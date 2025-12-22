import Link from "next/link";
import { Button } from "@/shared/ui/button";
import { Card } from "@/shared/ui/card";
import {
  Shield,
  Database,
  Server,
  Eye,
  Trash2,
  Mail,
  Activity,
  Mic,
} from "lucide-react";

export const metadata = {
  title: "Privacy Policy | GutVault",
  description:
    "Privacy policy for GutVault. We prioritize local-first storage and transparent data handling.",
};

export default function PrivacyPage() {
  const lastUpdated = "December 22, 2025";
  const contactEmail = "iliascodes@gmail.com";

  return (
    <div className="max-w-4xl mx-auto space-y-12 mt-12">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="inline-flex items-center justify-center p-3 bg-teal-100 dark:bg-teal-900/30 rounded-2xl mb-4">
          <Shield className="w-8 h-8 text-teal-600 dark:text-teal-400" />
        </div>
        <h1 className="text-4xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-5xl">
          Privacy Policy
        </h1>
        <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
          Your health data is yours. We built GutVault to be local-first,
          meaning your personal data stays on your device by default.
        </p>
        <p className="text-sm text-slate-500 dark:text-slate-500">
          Effective Date: {lastUpdated}
        </p>
      </div>

      {/* TL;DR Section */}
      <Card className="p-6 sm:p-8 bg-white dark:bg-slate-900 border-teal-100 dark:border-teal-900/50 shadow-sm">
        <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
          <Eye className="w-5 h-5 text-teal-600 dark:text-teal-400" />
          At a Glance (TL;DR)
        </h2>
        <div className="grid gap-4 sm:grid-cols-2 text-sm text-slate-600 dark:text-slate-400">
          <div className="flex gap-3">
            <Database className="w-5 h-5 text-slate-400 shrink-0" />
            <p>
              <strong className="text-slate-900 dark:text-slate-200">
                Local Storage:
              </strong>{" "}
              All your logs (meals, symptoms, etc.) are stored in your
              browser&apos;s IndexedDB. We don&apos;t have a central database of
              your health records.
            </p>
          </div>
          <div className="flex gap-3">
            <Server className="w-5 h-5 text-slate-400 shrink-0" />
            <p>
              <strong className="text-slate-900 dark:text-slate-200">
                No Account Needed:
              </strong>{" "}
              You don&apos;t need to create an account or provide an email to
              use the app.
            </p>
          </div>
          <div className="flex gap-3">
            <Mic className="w-5 h-5 text-slate-400 shrink-0" />
            <p>
              <strong className="text-slate-900 dark:text-slate-200">
                AI Processing:
              </strong>{" "}
              If you use voice logging, text transcripts are sent to OpenRouter
              for parsing. No raw audio is ever uploaded.
            </p>
          </div>
          <div className="flex gap-3">
            <Trash2 className="w-5 h-5 text-slate-400 shrink-0" />
            <p>
              <strong className="text-slate-900 dark:text-slate-200">
                Total Control:
              </strong>{" "}
              You can export your data or wipe it completely from your device at
              any time via Settings.
            </p>
          </div>
        </div>
      </Card>

      {/* Main Content */}
      <div className="prose prose-slate dark:prose-invert max-w-none space-y-12">
        {/* 1. Data Collection & Storage */}
        <section>
          <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
            1. Data Collection & Storage
          </h3>
          <p className="text-slate-600 dark:text-slate-400 mb-4">
            GutVault is a <strong>local-first application</strong>. This means
            the primary home for your data is your own device.
          </p>
          <div className="bg-slate-50 dark:bg-slate-900/50 rounded-xl p-6 border border-slate-200 dark:border-slate-800">
            <h4 className="font-semibold text-slate-900 dark:text-white mb-3">
              Where data is stored:
            </h4>
            <ul className="list-disc pl-5 space-y-2 text-slate-600 dark:text-slate-400">
              <li>
                <strong>IndexedDB:</strong> We use your browser&apos;s built-in
                database to store your logs (meals, symptoms, bowel movements,
                medications) and app preferences. This data remains on your
                device.
              </li>
              <li>
                <strong>Local Storage:</strong> We use minimal local storage for
                non-sensitive items like UI theme preferences (light/dark mode)
                and authentication credentials if applicable.
              </li>
            </ul>
          </div>
        </section>

        {/* 2. Data Categories */}
        <section>
          <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
            2. Data We Process
          </h3>
          <p className="text-slate-600 dark:text-slate-400 mb-4">
            To provide health tracking insights, the app processes the following
            categories of data you explicitly enter:
          </p>
          <div className="grid sm:grid-cols-2 gap-4">
            {[
              "Bowel Movements (Bristol Scale, Pain Level)",
              "Meals & Dietary Intake",
              "Symptoms (e.g., Bloating, Urgency)",
              "Medications & Supplements",
              "Voice Transcripts (for AI logging)",
              "App Preferences & Settings",
            ].map((item) => (
              <div
                key={item}
                className="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-800 p-3 rounded-lg border border-slate-200 dark:border-slate-700"
              >
                <Activity className="w-4 h-4 text-teal-500" />
                {item}
              </div>
            ))}
          </div>
        </section>

        {/* 3. Data Transmission & Third Parties */}
        <section>
          <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
            3. Data Transmission & Third Parties
          </h3>
          <p className="text-slate-600 dark:text-slate-400 mb-4">
            We do not sell your data. We do not transmit your health records to
            our own servers for storage. However, specific features require
            sending data to third-party AI providers for processing.
          </p>

          <div className="space-y-4">
            <div className="border-l-4 border-amber-400 bg-amber-50 dark:bg-amber-900/10 p-4 pl-6">
              <h4 className="font-semibold text-slate-900 dark:text-white mb-2">
                OpenRouter & AI Models
              </h4>
              <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">
                When you use the <strong>Voice Log</strong> or{" "}
                <strong>AI Food Analysis</strong> features, we send specific
                text data to OpenRouter (an API gateway) to access Large
                Language Models (LLMs).
              </p>
              <ul className="list-disc pl-5 space-y-1 text-sm text-slate-600 dark:text-slate-400">
                <li>
                  <strong>Voice Logs:</strong> Your device converts speech to
                  text. Only the <em>text transcript</em> is sent to the AI to
                  be structured into data. Raw audio is <strong>never</strong>{" "}
                  uploaded.
                </li>
                <li>
                  <strong>Food Analysis:</strong> Text descriptions of meals may
                  be sent to analyze ingredients or FODMAP content.
                </li>
              </ul>
              <p className="text-xs text-slate-500 mt-2">
                * Note: Data sent to these providers is ephemeral and used for
                generating the response. It is not used to train their models
                (subject to OpenRouter&apos;s privacy policy).
              </p>
            </div>
          </div>
        </section>

        {/* 4. Analytics & Cookies */}
        <section>
          <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
            4. Analytics & Cookies
          </h3>
          <p className="text-slate-600 dark:text-slate-400">
            GutVault does <strong>not</strong> use third-party analytics
            services (like Google Analytics) to track your behavior. We do not
            use tracking cookies. The &quot;Analytics&quot; you see in the
            dashboard are generated locally on your device using your own data.
          </p>
        </section>

        {/* 5. User Rights & Control */}
        <section>
          <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
            5. Your Rights & Controls
          </h3>
          <p className="text-slate-600 dark:text-slate-400 mb-6">
            Since you hold the data, you have complete control over it. You can
            manage your data directly within the app&apos;s Settings.
          </p>
          <div className="grid gap-6 sm:grid-cols-2">
            <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800">
              <h4 className="font-semibold text-slate-900 dark:text-white mb-2 flex items-center gap-2">
                <Database className="w-4 h-4 text-teal-500" />
                Export Data
              </h4>
              <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
                You can download a JSON copy of all your logs to keep a backup
                or share with a healthcare provider.
              </p>
              <Button variant="outline" size="sm" asChild>
                <Link href="/dashboard/settings">Go to Settings</Link>
              </Button>
            </div>
            <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800">
              <h4 className="font-semibold text-slate-900 dark:text-white mb-2 flex items-center gap-2">
                <Trash2 className="w-4 h-4 text-red-500" />
                Delete Data
              </h4>
              <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
                You can wipe all local data using the &quot;Clear Data&quot;
                option in Settings. This action is irreversible.
              </p>
              <Button variant="destructive" size="sm" asChild>
                <Link href="/dashboard/settings">Manage Data</Link>
              </Button>
            </div>
          </div>
        </section>

        {/* 6. Children's Privacy */}
        <section>
          <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
            6. Children&apos;s Privacy
          </h3>
          <p className="text-slate-600 dark:text-slate-400">
            GutVault is not intended for use by children under the age of 13. We
            do not knowingly collect personal information from children. If you
            are a parent or guardian and believe your child has used the app,
            you can clear the data directly on their device.
          </p>
        </section>

        {/* 7. Contact */}
        <section className="bg-slate-100 dark:bg-slate-900/50 rounded-2xl p-8 text-center">
          <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
            Questions?
          </h3>
          <p className="text-slate-600 dark:text-slate-400 mb-6">
            If you have any questions about this privacy policy or how your data
            is handled, please reach out.
          </p>
          <a
            href={`mailto:${contactEmail}`}
            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-medium rounded-full shadow-sm hover:shadow transition-shadow border border-slate-200 dark:border-slate-700"
          >
            <Mail className="w-5 h-5 text-teal-600" />
            {contactEmail}
          </a>
        </section>
      </div>
    </div>
  );
}
