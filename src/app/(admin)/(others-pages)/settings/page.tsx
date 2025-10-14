import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import SettingsPageClient from "@/components/settings/SettingsPageClient";
import type { Metadata } from "next";
import React from "react";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Settings Page",
  };
}

export default function SettingsPage() {
  return (
    <div className="min-h-screen bg-background">
      <PageBreadcrumb pageTitle="Settings" />
      <div className="grid grid-cols-12 gap-4 md:gap-6">
        <div className="col-span-12">
          <SettingsPageClient />
        </div>
      </div>
    </div>
  );
}
