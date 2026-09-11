package com.icesi.PhotoMarketApplication.service;

import com.icesi.PhotoMarketApplication.entity.Sale;
import com.lowagie.text.Document;
import com.lowagie.text.DocumentException;
import com.lowagie.text.Font;
import com.lowagie.text.FontFactory;
import com.lowagie.text.Paragraph;
import com.lowagie.text.alignment.HorizontalAlignment;
import com.lowagie.text.pdf.PdfWriter;
import org.springframework.stereotype.Service;

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.time.format.DateTimeFormatter;

@Service
public class PdfService {

    public ByteArrayInputStream generateCertificate(Sale sale) {
        Document document = new Document();
        ByteArrayOutputStream out = new ByteArrayOutputStream();

        try {
            PdfWriter.getInstance(document, out);
            document.open();

            Font titleFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 24);
            Font subtitleFont = FontFactory.getFont(FontFactory.HELVETICA, 16);
            Font bodyFont = FontFactory.getFont(FontFactory.HELVETICA, 12);

            Paragraph title = new Paragraph("CERTIFICATE OF AUTHENTICITY", titleFont);
            title.setAlignment(com.lowagie.text.Element.ALIGN_CENTER);
            document.add(title);
            
            document.add(new Paragraph(" "));
            document.add(new Paragraph(" "));

            Paragraph subtitle = new Paragraph("This certificate authenticates that the artwork detailed below is an original piece.", subtitleFont);
            subtitle.setAlignment(com.lowagie.text.Element.ALIGN_CENTER);
            document.add(subtitle);

            document.add(new Paragraph(" "));
            document.add(new Paragraph(" "));

            document.add(new Paragraph("Artwork Details:", FontFactory.getFont(FontFactory.HELVETICA_BOLD, 14)));
            document.add(new Paragraph("Title: " + sale.getPhotograph().getTitle(), bodyFont));
            document.add(new Paragraph("Edition: " + sale.getPhotograph().getEdition(), bodyFont));
            document.add(new Paragraph("Category: " + sale.getPhotograph().getCategory().getName(), bodyFont));
            
            document.add(new Paragraph(" "));
            
            document.add(new Paragraph("Author Details:", FontFactory.getFont(FontFactory.HELVETICA_BOLD, 14)));
            document.add(new Paragraph("Photographer: " + sale.getPhotograph().getPhotographer().getUser().getName(), bodyFont));
            
            document.add(new Paragraph(" "));
            
            document.add(new Paragraph("Sale Details:", FontFactory.getFont(FontFactory.HELVETICA_BOLD, 14)));
            document.add(new Paragraph("Sale ID: " + sale.getId(), bodyFont));
            DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");
            document.add(new Paragraph("Date of Purchase: " + sale.getSaleDate().format(formatter), bodyFont));
            document.add(new Paragraph("Price: $" + sale.getTotalAmount(), bodyFont));
            
            document.add(new Paragraph(" "));
            document.add(new Paragraph(" "));
            document.add(new Paragraph(" "));
            
            Paragraph footer = new Paragraph("Tin Cadena Fotografía - Alvaro Cadena", FontFactory.getFont(FontFactory.HELVETICA_OBLIQUE, 10));
            footer.setAlignment(com.lowagie.text.Element.ALIGN_CENTER);
            document.add(footer);

            document.close();
        } catch (DocumentException ex) {
            throw new RuntimeException("Error generating PDF certificate", ex);
        }

        return new ByteArrayInputStream(out.toByteArray());
    }
}
