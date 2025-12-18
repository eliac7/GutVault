"use client";

import { DataManagement } from "./data-management";
import { Preferences } from "./preferences";
import { SecuritySection } from "./security-section";
import { AboutSection } from "./about-section";

export function SettingsContent() {
  return (
    <div className="space-y-6 pb-8">
      <DataManagement />
      <Preferences />
      <SecuritySection />
      <AboutSection />
    </div>
  );
}
