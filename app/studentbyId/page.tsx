"use client";
import { useContext, useState } from "react";
import { AuthContext } from "@/app/context/AuthContext";

export default function DashboardPage() {
  const { Student } = useContext(AuthContext); // auth context se user mila
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  return <>{/* Yahan aapka UI code aayega */}</>;
}
