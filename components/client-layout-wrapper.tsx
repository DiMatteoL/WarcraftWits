"use client";

import React from "react";
import { PageTransitionLoader } from "@/components/page-transition-loader";

export function ClientLayoutWrapper({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <PageTransitionLoader />
    </>
  );
}
