import jsPDF from 'jspdf';
import { UnifiedProfile } from './unified-profile.service';
import { MisoAnalysisResult } from '@/types/miso-v3';

export const reportGeneratorService = {
    /**
     * Generate a professional PDF report from the MISO Analysis
     */
    async generatePDF(profile: UnifiedProfile, userName: string) {
        const doc = new jsPDF();
        const analysis = profile.miso_analysis;

        if (!analysis || !analysis.profile) {
            throw new Error('No analysis data available to generate report');
        }

        // -- Header --
        doc.setFillColor(102, 51, 153); // Purple header
        doc.rect(0, 0, 210, 40, 'F');

        doc.setTextColor(255, 255, 255);
        doc.setFontSize(22);
        doc.setFont('helvetica', 'bold');
        doc.text('MISO V3 Psychological Analysis', 20, 20);

        doc.setFontSize(12);
        doc.setFont('helvetica', 'normal');
        doc.text(`Report for: ${userName}`, 20, 30);
        doc.text(`Date: ${new Date().toLocaleDateString('vi-VN')}`, 150, 30);

        // -- Profile Summary --
        let yPos = 60;
        doc.setTextColor(0, 0, 0);

        // Core Profile ID
        doc.setFontSize(16);
        doc.setTextColor(102, 51, 153);
        doc.setFont('helvetica', 'bold');
        // @ts-expect-error - Profile dynamic property
        const profileName = analysis.profile.name || analysis.profile.id;
        doc.text(`Core Profile: ${profileName}`, 20, yPos);

        yPos += 10;
        doc.setFontSize(11);
        doc.setTextColor(60, 60, 60);
        doc.setFont('helvetica', 'italic');
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const mechanism = (analysis.profile as any).mechanism || 'No details available.';
        const splitMechanism = doc.splitTextToSize(String(mechanism), 170);
        doc.text(splitMechanism, 20, yPos);
        yPos += (splitMechanism.length * 7) + 10;

        // -- Scores --
        if (analysis.scores) {
            doc.setFont('helvetica', 'bold');
            doc.setTextColor(0, 0, 0);
            doc.text('Key Metrics', 20, yPos);
            yPos += 10;

            doc.setFont('helvetica', 'normal');
            doc.text(`Base Vulnerability Score (BVS): ${analysis.scores.BVS.toFixed(2)}`, 20, yPos);
            yPos += 7;
            doc.text(`Resilience Capacity Score (RCS): ${analysis.scores.RCS.toFixed(2)}`, 20, yPos);
            yPos += 15;
        }

        // -- Discrepancies --
        if (analysis.discrepancies && analysis.discrepancies.length > 0) {
            doc.setFont('helvetica', 'bold');
            doc.text('Risk Factors Detected', 20, yPos);
            yPos += 10;

            analysis.discrepancies.forEach((disc) => {
                doc.setFont('helvetica', 'bold');
                doc.setFontSize(10);
                doc.text(`• ${disc.name}`, 25, yPos);
                yPos += 5;

                doc.setFont('helvetica', 'normal');
                const splitInterp = doc.splitTextToSize(disc.interpretation, 160);
                doc.text(splitInterp, 30, yPos);
                yPos += (splitInterp.length * 5) + 5;
            });
            yPos += 5;
        }

        // -- Interventions --
        if (analysis.interventions) {
            // Check page break
            if (yPos > 250) {
                doc.addPage();
                yPos = 20;
            }

            doc.setFontSize(14);
            doc.setFont('helvetica', 'bold');
            doc.setTextColor(102, 51, 153);
            doc.text('Recommended Action Plan', 20, yPos);
            yPos += 10;

            // Immediate
            const immediate = analysis.interventions.immediate || [];
            if (immediate.length > 0) {
                doc.setFontSize(12);
                doc.setTextColor(0, 0, 0);
                doc.text('Immediate Actions:', 20, yPos);
                yPos += 7;

                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                immediate.forEach((item: any) => {
                    doc.setFontSize(10);
                    doc.text(`- ${item.type.replace(/_/g, ' ')}`, 25, yPos);
                    yPos += 6;
                });
                yPos += 5;
            }

            // Short Term
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const shortTerm = (analysis.interventions as any).short_term || [];
            if (shortTerm.length > 0) {
                doc.setFontSize(12);
                doc.text('Short-term Strategy:', 20, yPos);
                yPos += 7;

                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                shortTerm.forEach((item: any) => {
                    doc.setFontSize(10);
                    doc.text(`- ${item.type.replace(/_/g, ' ')}`, 25, yPos);
                    yPos += 6;
                });
            }
        }

        // Footer
        const pageCount = doc.getNumberOfPages();
        for (let i = 1; i <= pageCount; i++) {
            doc.setPage(i);
            doc.setFontSize(10);
            doc.setTextColor(150);
            doc.text(`Page ${i} of ${pageCount}`, 105, 290, { align: 'center' });
            doc.text('Generated by MISO V3 System', 20, 290);
        }

        doc.save(`MISO_Report_${userName.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.pdf`);
    }
};
