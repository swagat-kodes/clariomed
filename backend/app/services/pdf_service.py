import fitz  # PyMuPDF
from typing import List, Tuple
import io

class PDFService:
    @staticmethod
    def render_pdf_to_images(file_bytes: bytes, dpi: int = 150) -> List[Tuple[bytes, str]]:
        """
        Renders PDF pages to PNG image byte streams using PyMuPDF (fitz).
        Returns a list of tuples containing (image_bytes, mime_type).
        """
        images = []
        doc = fitz.open(stream=file_bytes, filetype="pdf")
        
        for page_num in range(len(doc)):
            page = doc.load_page(page_num)
            zoom = dpi / 72
            mat = fitz.Matrix(zoom, zoom)
            pix = page.get_pixmap(matrix=mat, alpha=False)
            
            img_byte_arr = io.BytesIO()
            img_byte_arr.write(pix.tobytes(output="png"))
            images.append((img_byte_arr.getvalue(), "image/png"))
            
        doc.close()
        return images

pdf_service = PDFService()
