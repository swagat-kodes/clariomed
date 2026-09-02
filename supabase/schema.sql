-- Enable pgvector extension for AI embeddings (Google text-embedding-004: 768 dimensions)
CREATE EXTENSION IF NOT EXISTS vector;

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Reports Table
CREATE TABLE IF NOT EXISTS public.reports (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    filename TEXT NOT NULL,
    storage_path TEXT,
    simplification TEXT NOT NULL,
    key_findings TEXT[] DEFAULT '{}',
    actionable_questions TEXT[] DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Lab Results Table
CREATE TABLE IF NOT EXISTS public.lab_results (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    report_id UUID REFERENCES public.reports(id) ON DELETE CASCADE NOT NULL,
    test_name TEXT NOT NULL,
    observed_value TEXT NOT NULL,
    reference_range TEXT,
    status TEXT NOT NULL CHECK (status IN ('High', 'Low', 'Normal')),
    explanation TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Report Embeddings Table (768 dimensions for Google text-embedding-004)
CREATE TABLE IF NOT EXISTS public.report_embeddings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    report_id UUID REFERENCES public.reports(id) ON DELETE CASCADE NOT NULL,
    content_chunk TEXT NOT NULL,
    embedding vector(768) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Index for HNSW vector similarity search on report embeddings
CREATE INDEX IF NOT EXISTS report_embeddings_vector_idx 
ON public.report_embeddings 
USING hnsw (embedding vector_cosine_ops);

-- Index for foreign keys
CREATE INDEX IF NOT EXISTS idx_lab_results_report_id ON public.lab_results(report_id);
CREATE INDEX IF NOT EXISTS idx_reports_user_id ON public.reports(user_id);

-- Enable Row Level Security (RLS) on all tables
ALTER TABLE public.reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lab_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.report_embeddings ENABLE ROW LEVEL SECURITY;

-- RLS Policies for Reports
CREATE POLICY "Users can view their own reports"
    ON public.reports FOR SELECT
    USING (auth.uid() = user_id OR user_id IS NULL);

CREATE POLICY "Users can insert their own reports"
    ON public.reports FOR INSERT
    WITH CHECK (auth.uid() = user_id OR user_id IS NULL);

CREATE POLICY "Users can update their own reports"
    ON public.reports FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own reports"
    ON public.reports FOR DELETE
    USING (auth.uid() = user_id);

-- RLS Policies for Lab Results
CREATE POLICY "Users can view lab results of their reports"
    ON public.lab_results FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.reports
            WHERE reports.id = lab_results.report_id
            AND (reports.user_id = auth.uid() OR reports.user_id IS NULL)
        )
    );

CREATE POLICY "Users can insert lab results for their reports"
    ON public.lab_results FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.reports
            WHERE reports.id = lab_results.report_id
            AND (reports.user_id = auth.uid() OR reports.user_id IS NULL)
        )
    );

-- RLS Policies for Report Embeddings
CREATE POLICY "Users can view embeddings of their reports"
    ON public.report_embeddings FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.reports
            WHERE reports.id = report_embeddings.report_id
            AND (reports.user_id = auth.uid() OR reports.user_id IS NULL)
        )
    );

CREATE POLICY "Users can insert embeddings for their reports"
    ON public.report_embeddings FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.reports
            WHERE reports.id = report_embeddings.report_id
            AND (reports.user_id = auth.uid() OR reports.user_id IS NULL)
        )
    );

-- Storage Bucket Setup & RLS Policy for Medical Documents Storage Bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('medical-reports', 'medical-reports', false)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Authenticated users can upload medical report files"
    ON storage.objects FOR INSERT
    WITH CHECK (bucket_id = 'medical-reports' AND (auth.role() = 'authenticated' OR auth.role() = 'anon'));

CREATE POLICY "Users can read their medical report files"
    ON storage.objects FOR SELECT
    USING (bucket_id = 'medical-reports');
