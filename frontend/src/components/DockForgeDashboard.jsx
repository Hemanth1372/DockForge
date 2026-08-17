import React, { useState } from "react";
import {
  Upload,
  FileCode,
  CheckCircle2,
  AlertTriangle,
  Play,
  Download,
  Terminal,
  Activity,
  Server,
  Layers,
  ShieldCheck,
  RefreshCw,
  XCircle,
} from "lucide-react";

export default function DockForgeDashboard() {
  const [projectId, setProjectId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [projectData, setProjectData] = useState(null);
  const [activeTab, setActiveTab] = useState("dockerfile");
  const [verifying, setVerifying] = useState(false);
  const [testingRuntime, setTestingRuntime] = useState(false);
  const [fileName, setFileName] = useState("");
  const [actionStatus, setActionStatus] = useState("");

  // 1. Upload ZIP Archive to Backend Control Plane (Port 5000)
  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setFileName(file.name);
    setLoading(true);
    setActionStatus("Extracting repository & analyzing dependencies...");

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("http://localhost:5000/api/projects/upload", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();

      if (data.success && data.project) {
        setProjectId(data.project.id);
        setProjectData(data.project); // Sets full context including files & summary
        setActionStatus("Analysis complete! Docker artifacts generated.");
      } else {
        setActionStatus(`Upload Error: ${data.message || "Pipeline failure."}`);
      }
    } catch (err) {
      setActionStatus(
        "Failed to connect to backend control plane (Port 5000).",
      );
      console.error("Pipeline connection error:", err);
    } finally {
      setLoading(false);
    }
  };

  // 2. Fetch/Refresh Project Data
  const fetchProjectPreview = async (id) => {
    try {
      const res = await fetch(`http://localhost:5000/api/projects/${id}`);
      const data = await res.json();
      if (data.success && data.project) {
        setProjectData(data.project);
      }
    } catch (err) {
      console.error("Preview fetch error:", err);
    }
  };

  // 3. Trigger Docker Compilation Check
  const handleVerify = async () => {
    if (!projectId) return;
    setVerifying(true);
    setActionStatus(
      "Executing 'docker build' check against local Docker engine...",
    );

    try {
      const res = await fetch(
        `http://localhost:5000/api/projects/${projectId}/verify`,
        {
          method: "POST",
        },
      );
      const data = await res.json();

      if (data.success) {
        setActionStatus("Docker compilation check finished!");
        await fetchProjectPreview(projectId);
      } else {
        setActionStatus(
          `Verification failed: ${data.message || "Compilation error."}`,
        );
      }
    } catch (err) {
      setActionStatus("Server error executing Docker CLI check.");
      console.error("Verification error:", err);
    } finally {
      setVerifying(false);
    }
  };

  // 4. Trigger Container Runtime Test
  const handleRuntimeCheck = async () => {
    if (!projectId) return;
    setTestingRuntime(true);
    setActionStatus(
      "Booting Docker Compose stack & probing application port...",
    );

    try {
      const res = await fetch(
        `http://localhost:5000/api/projects/${projectId}/runtime-check`,
        {
          method: "POST",
        },
      );
      const data = await res.json();

      if (data.success) {
        setActionStatus("Runtime health probe completed!");
        await fetchProjectPreview(projectId);
      } else {
        setActionStatus(
          `Runtime check failed: ${data.message || "Container startup failed."}`,
        );
      }
    } catch (err) {
      setActionStatus("Server error testing runtime health.");
      console.error("Runtime test error:", err);
    } finally {
      setTestingRuntime(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans p-6 md:p-8">
      {/* Header */}
      <header className="max-w-7xl mx-auto flex items-center justify-between border-b border-slate-800 pb-5 mb-8">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-blue-600 rounded-xl shadow-lg shadow-blue-500/20">
            <Layers className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
              DockForge{" "}
              <span className="text-[10px] bg-blue-500/10 text-blue-400 border border-blue-500/20 px-2 py-0.5 rounded-full font-mono font-medium">
                v1.0
              </span>
            </h1>
            <p className="text-xs text-slate-400">
              AI Containerization & Infrastructure Pipeline
            </p>
          </div>
        </div>

        {projectId && (
          <a
            href={`http://localhost:5000/api/projects/${projectId}/download`}
            className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold px-4 py-2.5 rounded-lg transition-colors shadow-md shadow-emerald-900/20"
          >
            <Download className="w-4 h-4" /> Export Workspace ZIP
          </a>
        )}
      </header>

      {/* Main Workspace */}
      <main className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column Controls */}
        <div className="lg:col-span-4 space-y-6">
          {/* Upload Area */}
          <div className="border-2 border-dashed border-slate-800 hover:border-blue-500/50 bg-slate-900/40 rounded-2xl p-6 text-center transition-all">
            <div className="w-12 h-12 bg-blue-600/10 rounded-full flex items-center justify-center mx-auto text-blue-400 mb-3 border border-blue-500/20">
              <Upload className="w-6 h-6" />
            </div>
            <h3 className="text-sm font-semibold text-slate-200">
              Upload Project Repository
            </h3>
            <p className="text-xs text-slate-500 mt-1 mb-4">
              Select a .ZIP source archive to inspect and containerize
            </p>

            <label className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold px-5 py-2.5 rounded-lg cursor-pointer transition-all shadow-md shadow-blue-600/20">
              {loading ? (
                <RefreshCw className="w-4 h-4 animate-spin" />
              ) : (
                <Upload className="w-4 h-4" />
              )}
              {loading ? "Analyzing Repository..." : "Select ZIP Archive"}
              <input
                type="file"
                accept=".zip"
                onChange={handleFileUpload}
                className="hidden"
              />
            </label>

            {fileName && (
              <p className="text-[11px] text-blue-400 mt-3 font-mono truncate max-w-[220px] mx-auto">
                📦 {fileName}
              </p>
            )}
          </div>

          {/* Active Execution Banner */}
          {actionStatus && (
            <div className="p-3 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-mono flex items-center justify-between">
              <span className="truncate pr-2">{actionStatus}</span>
              {(loading || verifying || testingRuntime) && (
                <RefreshCw className="w-4 h-4 animate-spin text-blue-400 shrink-0" />
              )}
            </div>
          )}

          {/* Analysis Summary Card */}
          {projectData && (
            <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Analysis Summary
                </span>
                <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20">
                  {projectData.summary?.confidenceScore || 95}% Confidence
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2.5 text-xs">
                <div className="bg-slate-950/80 p-3 rounded-xl border border-slate-800/60">
                  <span className="text-slate-500 text-[10px] block uppercase font-mono">
                    Language
                  </span>
                  <span className="font-semibold text-slate-200 mt-0.5 block">
                    {projectData.summary?.language || "Unknown"}
                  </span>
                </div>
                <div className="bg-slate-950/80 p-3 rounded-xl border border-slate-800/60">
                  <span className="text-slate-500 text-[10px] block uppercase font-mono">
                    Framework
                  </span>
                  <span className="font-semibold text-slate-200 mt-0.5 block">
                    {projectData.summary?.framework || "Standard"}
                  </span>
                </div>
                <div className="bg-slate-950/80 p-3 rounded-xl border border-slate-800/60">
                  <span className="text-slate-500 text-[10px] block uppercase font-mono">
                    Target Port
                  </span>
                  <span className="font-semibold text-slate-200 mt-0.5 block">
                    :{projectData.summary?.port || 3000}
                  </span>
                </div>
                <div className="bg-slate-950/80 p-3 rounded-xl border border-slate-800/60">
                  <span className="text-slate-500 text-[10px] block uppercase font-mono">
                    Infrastructure
                  </span>
                  <span className="font-semibold text-slate-200 mt-0.5 block truncate">
                    {projectData.summary?.services?.length > 0
                      ? projectData.summary.services.join(", ")
                      : "None"}
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 space-y-2">
                <button
                  onClick={handleVerify}
                  disabled={verifying}
                  className="w-full flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-700 disabled:opacity-50 text-slate-200 text-xs font-medium py-2.5 rounded-xl border border-slate-700 transition-colors"
                >
                  <ShieldCheck className="w-4 h-4 text-blue-400" />
                  {verifying
                    ? "Executing Docker Build..."
                    : "Verify Docker Compilation"}
                </button>
                <button
                  onClick={handleRuntimeCheck}
                  disabled={testingRuntime}
                  className="w-full flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-700 disabled:opacity-50 text-slate-200 text-xs font-medium py-2.5 rounded-xl border border-slate-700 transition-colors"
                >
                  <Play className="w-4 h-4 text-emerald-400" />
                  {testingRuntime
                    ? "Booting Containers..."
                    : "Test Container Runtime"}
                </button>
              </div>

              {/* Inline Verification Status Banner */}
              {projectData?.verification && (
                <div
                  className={`p-3.5 rounded-xl border text-xs font-mono transition-all ${
                    projectData.verification.buildValid
                      ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400"
                      : "bg-rose-500/10 border-rose-500/20 text-rose-400"
                  }`}
                >
                  <div className="flex items-center justify-between font-semibold">
                    <span className="flex items-center gap-1.5">
                      {projectData.verification.buildValid ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      ) : (
                        <XCircle className="w-4 h-4 text-rose-400" />
                      )}
                      Docker Compilation
                    </span>
                    <span>
                      {projectData.verification.buildValid
                        ? "PASSED"
                        : "FAILED"}
                    </span>
                  </div>
                  {projectData.verification.buildError && (
                    <p className="text-[11px] text-slate-400 mt-2 whitespace-pre-wrap font-mono">
                      {projectData.verification.buildError}
                    </p>
                  )}
                </div>
              )}

              {/* Inline Runtime Probe Status Banner */}
              {projectData?.runtimeValidation && (
                <div
                  className={`p-3.5 rounded-xl border text-xs font-mono transition-all ${
                    projectData.runtimeValidation.healthy
                      ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400"
                      : "bg-amber-500/10 border-amber-500/20 text-amber-400"
                  }`}
                >
                  <div className="flex items-center justify-between font-semibold">
                    <span className="flex items-center gap-1.5">
                      {projectData.runtimeValidation.healthy ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      ) : (
                        <AlertTriangle className="w-4 h-4 text-amber-400" />
                      )}
                      Runtime Health Probe
                    </span>
                    <span>
                      {projectData.runtimeValidation.healthy
                        ? "200 OK"
                        : "UNHEALTHY"}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1.5">
                    {projectData.runtimeValidation.healthy
                      ? `Container active and responding on port :${projectData.runtimeValidation.port}`
                      : "Container booted, but endpoint probe timed out or returned non-200 response."}
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Containerization Decision Audit Log */}
          {projectData?.audit && (
            <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 space-y-3">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-2">
                <Terminal className="w-4 h-4 text-blue-400" /> Containerization
                Decisions
              </h4>
              <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                {projectData.audit.decisions.map((item, idx) => (
                  <div
                    key={idx}
                    className="p-3 bg-slate-950/60 rounded-xl border border-slate-800/80 text-xs"
                  >
                    <div className="flex items-center justify-between text-slate-200 font-medium">
                      <span>
                        {item.category}: {item.finding}
                      </span>
                      <span className="text-[10px] text-slate-500 font-mono">
                        {item.confidence}%
                      </span>
                    </div>
                    <p className="text-slate-400 text-[11px] mt-1 leading-normal">
                      {item.reason}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Code Preview Panel */}
        <div className="lg:col-span-8 bg-slate-900/80 border border-slate-800 rounded-2xl overflow-hidden flex flex-col h-[680px]">
          {/* Header File Tabs */}
          <div className="flex items-center justify-between bg-slate-950/80 border-b border-slate-800/80 px-4 pt-3">
            <div className="flex items-center gap-1">
              <button
                onClick={() => setActiveTab("dockerfile")}
                className={`flex items-center gap-2 text-xs font-medium px-4 py-2.5 rounded-t-lg transition-all border-b-2 ${
                  activeTab === "dockerfile"
                    ? "border-blue-500 text-blue-400 bg-slate-900"
                    : "border-transparent text-slate-400 hover:text-slate-200"
                }`}
              >
                <FileCode className="w-4 h-4" /> Dockerfile
              </button>
              <button
                onClick={() => setActiveTab("compose")}
                className={`flex items-center gap-2 text-xs font-medium px-4 py-2.5 rounded-t-lg transition-all border-b-2 ${
                  activeTab === "compose"
                    ? "border-blue-500 text-blue-400 bg-slate-900"
                    : "border-transparent text-slate-400 hover:text-slate-200"
                }`}
              >
                <Server className="w-4 h-4" /> docker-compose.yml
              </button>
              <button
                onClick={() => setActiveTab("readme")}
                className={`flex items-center gap-2 text-xs font-medium px-4 py-2.5 rounded-t-lg transition-all border-b-2 ${
                  activeTab === "readme"
                    ? "border-blue-500 text-blue-400 bg-slate-900"
                    : "border-transparent text-slate-400 hover:text-slate-200"
                }`}
              >
                <Activity className="w-4 h-4" /> README-DOCKER.md
              </button>
            </div>
          </div>

          {/* Code Viewer Text Area */}
          <div className="p-6 flex-1 overflow-auto bg-slate-950 font-mono text-xs leading-relaxed text-slate-300">
            {projectData?.files ? (
              <pre className="whitespace-pre-wrap">
                {activeTab === "dockerfile" &&
                  (projectData.files.dockerfile || "# Dockerfile pending...")}
                {activeTab === "compose" &&
                  (projectData.files.compose ||
                    "# docker-compose.yml pending...")}
                {activeTab === "readme" &&
                  (projectData.files.readme || "# README pending...")}
              </pre>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-slate-600">
                <FileCode className="w-12 h-12 mb-3 stroke-[1.5] text-slate-700" />
                <p className="text-xs">
                  Upload a ZIP repository archive to generate and preview Docker
                  artifacts
                </p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
