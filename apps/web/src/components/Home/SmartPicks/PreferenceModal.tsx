import { t } from "@/lib/internationalisation/i18n-helpers";
import { Messages } from "@calculories/shared-types";
import { useState } from "react";

export interface PreferencePayload {
  selected_pills: string[];
  custom_text: string | null;
}

interface PreferenceModalProps {
  isOpen: boolean;
  messages: Messages;
  onClose: () => void;
  onApply: (preferences: PreferencePayload) => void;
}

export default function PreferenceModal({
  isOpen,
  onClose,
  onApply,
  messages,
}: PreferenceModalProps) {
  const [showAddMoreView, setShowAddMoreView] = useState(false);
  const [selectedPills, setSelectedPills] = useState<string[]>([]);
  const [customText, setCustomText] = useState<string>("");
  const [tempCustomText, setTempCustomText] = useState<string>("");

  if (!isOpen) return null;

  const togglePill = (tag: string) => {
    setSelectedPills((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag],
    );
  };

  const handleAddCustomPreference = () => {
    if (tempCustomText.trim() !== "") {
      setCustomText((prev) =>
        prev ? `${prev}, ${tempCustomText.trim()}` : tempCustomText.trim(),
      );
    }
    setTempCustomText("");
    setShowAddMoreView(false);
  };

  const handleResetCustomText = () => {
    setTempCustomText("");
    setCustomText("");
  };

  const handleApply = () => {
    onApply({
      selected_pills: selectedPills,
      custom_text: customText.trim() !== "" ? customText.trim() : null,
    });
  };

  return (
    <div className="fixed inset-y-0 left-1/2 z-50 flex w-full max-w-105 -translate-x-1/2 items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-xl">
        {!showAddMoreView ? (
          <MainPreferenceView
            onClose={onClose}
            selectedPills={selectedPills}
            togglePill={togglePill}
            customText={customText}
            setCustomText={setCustomText}
            onAddMoreClick={() => {
              setTempCustomText("");
              setShowAddMoreView(true);
            }}
            onApply={handleApply}
            messages={messages}
          />
        ) : (
          <AddCustomPreferenceView
            onClose={() => setShowAddMoreView(false)}
            tempCustomText={tempCustomText}
            setTempCustomText={setTempCustomText}
            onReset={handleResetCustomText}
            onAdd={handleAddCustomPreference}
            messages={messages}
          />
        )}
      </div>
    </div>
  );
}

interface MainPreferenceViewProps {
  onClose: () => void;
  selectedPills: string[];
  togglePill: (tag: string) => void;
  customText: string;
  setCustomText: (text: string) => void;
  onAddMoreClick: () => void;
  onApply: () => void;
  messages: Messages;
}

function MainPreferenceView({
  onClose,
  selectedPills,
  togglePill,
  customText,
  setCustomText,
  onAddMoreClick,
  onApply,
  messages,
}: MainPreferenceViewProps) {
  const DEFAULT_PREFERENCES = [
    t("high-protein", messages),
    t("healthy", messages),
    t("comfort-food", messages),
    t("cheap-meals", messages),
    t("spicy", messages),
    t("dessert", messages),
  ];

  return (
    <>
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-grey-100 text-2xl font-bold">
            {t("not-quite-right", messages)}
          </h2>
          <p className="text-grey-60 mt-1 text-sm">
            {t("help-us-improve", messages)}
          </p>
        </div>
        <button
          onClick={onClose}
          className="text-grey-40 hover:text-grey-100 hover:cursor-pointer"
        >
          ✕
        </button>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-3">
        {DEFAULT_PREFERENCES.map((tag) => (
          <button
            key={tag}
            onClick={() => togglePill(tag)}
            className={`rounded-xl px-4 py-3 text-sm font-bold transition-colors hover:cursor-pointer ${
              selectedPills.includes(tag)
                ? "bg-green-10 border-2 border-green-100 text-green-100"
                : "text-grey-80 border-grey-10 bg-grey-10 border-2"
            }`}
          >
            {tag}
          </button>
        ))}
      </div>

      {customText && (
        <div className="mt-4 flex flex-wrap gap-2">
          <span
            onClick={() => setCustomText("")}
            className="bg-green-10 flex cursor-pointer items-center space-x-1 rounded-full border-2 border-green-100 px-3 py-1 text-xs font-semibold text-green-100"
            title="Click to remove custom preferences"
          >
            <span>{customText}</span>
            <span>✕</span>
          </span>
        </div>
      )}

      <button
        onClick={onAddMoreClick}
        className="mt-6 flex w-full items-center justify-center space-x-2 text-sm font-semibold text-green-100 hover:cursor-pointer"
      >
        <span className="text-lg">+</span>
        <span>{t("add-more-preferences", messages)}</span>
      </button>

      <button
        onClick={onApply}
        className="bg-grey-100 hover:bg-grey-80 mt-6 w-full rounded-2xl px-17 py-2 font-semibold text-white transition-transform hover:cursor-pointer active:scale-95"
      >
        {t("refresh-recommendations", messages)}
      </button>
    </>
  );
}

interface AddCustomPreferenceViewProps {
  onClose: () => void;
  tempCustomText: string;
  setTempCustomText: (text: string) => void;
  onReset: () => void;
  onAdd: () => void;
  messages: Messages;
}

function AddCustomPreferenceView({
  onClose,
  tempCustomText,
  setTempCustomText,
  onReset,
  onAdd,
  messages,
}: AddCustomPreferenceViewProps) {
  return (
    <>
      <div className="-mx-6 flex items-center justify-between border-b px-6 pb-4">
        <button
          onClick={onClose}
          className="text-grey-40 hover:text-grey-100 hover:cursor-pointer"
        >
          ✕
        </button>
        <h3 className="text-grey-100 font-semibold">
          {t("add-more-preferences", messages)}
        </h3>
        <button
          onClick={onReset}
          className="hover:text-green-60 text-sm font-medium text-green-100 hover:cursor-pointer"
        >
          {t("reset", messages)}
        </button>
      </div>

      <div className="mt-6">
        <label className="text-grey-100 text-sm font-semibold">
          {t("input-your-preference", messages)}
        </label>
        <textarea
          value={tempCustomText}
          onChange={(e) => setTempCustomText(e.target.value)}
          placeholder={t("example-input", messages)}
          className="border-grey-20 bg-background-1 mt-2 w-full rounded-xl border p-4 text-sm focus:border-green-100 focus:ring-1 focus:ring-green-100 focus:outline-none"
          rows={4}
          maxLength={50}
        />
        <div className="text-grey-40 mt-1 text-right text-xs">
          {tempCustomText.length}/50
        </div>
      </div>

      <button
        onClick={onAdd}
        className="hover:bg-green-60 mt-6 flex w-full items-center justify-center space-x-2 rounded-2xl bg-green-100 py-4 font-semibold text-white transition-transform hover:cursor-pointer active:scale-95"
      >
        <span className="text-lg">+</span>
        <span>{t("add-preference", messages)}</span>
      </button>
    </>
  );
}
