import Konva from "konva";
import React, { RefObject, useContext, useState } from "react";
import { motion, Variants } from "framer-motion";
import styles from "./styles.module.css";
import { FiDownload } from "react-icons/fi";
import { FaImage } from "react-icons/fa6";
import { PiFilePdf } from "react-icons/pi";
import { TContext, UContext } from "@/components/lib/UserContext";
import Button from "@/components/ui/Button";
import { PDFDocument } from "pdf-lib";

interface TProps {
  stageRef: RefObject<Konva.Stage>;
}

const itemVariants: Variants = {
  open: {
    opacity: 1,
    x: 0,
    transition: { type: "spring", stiffness: 300, damping: 24 },
  },
  closed: { opacity: 0, x: -10, transition: { duration: 0.1 } },
};

export default function Download({ stageRef }: TProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { context } = useContext(UContext) as TContext;

  const downloadImage = () => {
    if (stageRef.current) {
      const dataURL = stageRef.current.toDataURL({ mimeType: "image/png" });
      const link = document.createElement("a");
      link.href = dataURL;
      link.style.display = "none";
      link.download = `SketchSync_${context.roomCode}.png`;

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const downloadPDF = async () => {
    if (stageRef.current) {
      const stage = stageRef.current.getStage();
      const dataURL = stageRef.current.toDataURL({ mimeType: "image/png" });

      const imageData = await fetch(dataURL).then((res) => res.arrayBuffer());

      const pdfDoc = await PDFDocument.create();

      const page = pdfDoc.addPage([stage.width(), stage.height()]);

      const image = await pdfDoc.embedPng(imageData);
      const { width, height } = image.scale(1); // Adjust scale as needed
      page.drawImage(image, {
        x: 0,
        y: 0,
        width,
        height,
      });

      const pdfBytes = await pdfDoc.save();

      const link = document.createElement("a");
      link.href = URL.createObjectURL(
        new Blob([pdfBytes], { type: "application/pdf" }),
      );
      link.style.display = "none";
      link.download = `SketchSync_${context.roomCode}.pdf`;

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <motion.div
      className={styles.download}
      initial={false}
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
      animate={isOpen ? "open" : "closed"}
    >
      <Button.LowContrast
        className={"lowContrastClickable"}
        onClick={downloadImage}
      >
        {isOpen ? <FaImage /> : <FiDownload />}
      </Button.LowContrast>
      <motion.div
        className={styles.menu}
        variants={{
          open: {
            width: "fit-content",
            transition: {
              type: "spring",
              bounce: 0,
              duration: 0.3,
              delayChildren: 0.05,
              staggerChildren: 0.02,
            },
          },
          closed: {
            width: 0,
            transition: {
              type: "spring",
              bounce: 0,
              duration: 0.3,
            },
          },
        }}
      >
        <motion.button
          className={"lowContrastClickable"}
          onClick={downloadPDF}
          variants={itemVariants}
        >
          <PiFilePdf />
        </motion.button>
      </motion.div>
    </motion.div>
  );
}
