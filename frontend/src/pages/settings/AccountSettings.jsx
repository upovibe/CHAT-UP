import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { useAuth } from "@/stores/useAuth";

const AccountSettings = () => {
  const { visibilityPreferences, updateVisibilityPreferences } = useAuth();
  const { toast } = useToast();

  // Local state for visibility toggles
  const [localPreferences, setLocalPreferences] = useState({
    showEmail: true,
    showPhone: true,
    showStatus: true,
  });

  useEffect(() => {
    // Sync local state with store visibilityPreferences
    if (visibilityPreferences) {
      setLocalPreferences(visibilityPreferences);
    }
  }, [visibilityPreferences]);

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      // Save preferences to backend
      await updateVisibilityPreferences(localPreferences);
      toast({ title: "Success", description: "Preferences updated successfully!" });
    } catch (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    }
  };

  const togglePreference = (key) => {
    setLocalPreferences((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <form onSubmit={onSubmit} className="w-full space-y-6">
      {/* Toggle for Email */}
      <div className="flex items-center justify-between rounded-lg border p-3 shadow-sm">
        <div className="space-y-0.5">
          <label>Email</label>
          <p>{localPreferences.showEmail ? "Hide email field" : "Show email field"}</p>
        </div>
        <Switch
          checked={localPreferences.showEmail}
          onCheckedChange={() => togglePreference("showEmail")}
        />
      </div>

      {/* Toggle for Phone */}
      <div className="flex items-center justify-between rounded-lg border p-3 shadow-sm">
        <div className="space-y-0.5">
          <label>Phone Number</label>
          <p>{localPreferences.showPhone ? "Hide phone number field" : "Show phone number field"}</p>
        </div>
        <Switch
          checked={localPreferences.showPhone}
          onCheckedChange={() => togglePreference("showPhone")}
        />
      </div>

      {/* Toggle for Status */}
      <div className="flex items-center justify-between rounded-lg border p-3 shadow-sm">
        <div className="space-y-0.5">
          <label>Status</label>
          <p>{localPreferences.showStatus ? "Hide status field" : "Show status field"}</p>
        </div>
        <Switch
          checked={localPreferences.showStatus}
          onCheckedChange={() => togglePreference("showStatus")}
        />
      </div>

      <Button type="submit">Save Preferences</Button>
    </form>
  );
};

export default AccountSettings;
