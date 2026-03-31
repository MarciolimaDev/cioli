import { Metadata } from "next";
import DataDeletion from "../pages/DataDeletion/DataDeletion";

export const metadata: Metadata = {
  title: "Exclusao de Dados | Cioli Dev",
  description:
    "Instrucoes para solicitar exclusao de dados pessoais tratados pela CIOLI.",
};

export default function DataDeletionPage() {
  return <DataDeletion />;
}
