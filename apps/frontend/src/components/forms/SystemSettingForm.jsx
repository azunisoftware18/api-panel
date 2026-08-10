"use client";

import { useEffect, useState } from "react";

import Button from "@/components/ui/Button";
import InputField from "@/components/ui/InputField";
import Alert from "@/components/ui/Alert";

import {
  Building2,
  Upload,
  Globe,
  Mail,
  Phone,
  MessageCircle,
  Facebook,
  Instagram,
  Twitter,
  Linkedin,
  AlertCircle,
} from "lucide-react";

import { systemSettingValidation } from "@/validation/systemSettingValidation";
import { getValidationErrors } from "@/utils/validationErrors";

export default function SystemSettingForm({ initialData, onSubmit, onCancel }) {
  const [formData, setFormData] = useState({
    companyName: "",
    companyLogo: null,
    favIcon: null,
    phoneNumber: "",
    whtsappNumber: "",
    companyEmail: "",
    facebookUrl: "",
    instagramUrl: "",
    twitterUrl: "",
    linkedinUrl: "",
    settings: "",
  });

  const [logoPreview, setLogoPreview] = useState("");

  const [favPreview, setFavPreview] = useState("");

  const [errors, setErrors] = useState({});

  const [formError, setFormError] = useState("");

  useEffect(() => {
    if (!initialData) return;

    setFormData({
      companyName: initialData.companyName || "",
      companyLogo: null,
      favIcon: null,
      phoneNumber: initialData.phoneNumber || "",
      whtsappNumber: initialData.whtsappNumber || "",
      companyEmail: initialData.companyEmail || "",
      facebookUrl: initialData.facebookUrl || "",
      instagramUrl: initialData.instagramUrl || "",
      twitterUrl: initialData.twitterUrl || "",
      linkedinUrl: initialData.linkedinUrl || "",
      settings: initialData.settings
        ? JSON.stringify(initialData.settings, null, 2)
        : "",
    });

    setLogoPreview(initialData.companyLogo || "");

    setFavPreview(initialData.favIcon || "");
  }, [initialData]);

  const clearError = (field) => {
    setErrors((prev) => ({
      ...prev,
      [field]: "",
    }));

    setFormError("");
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    clearError(name);
  };

  const handleLogo = (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    setFormData((prev) => ({
      ...prev,
      companyLogo: file,
    }));

    setLogoPreview(URL.createObjectURL(file));
  };

  const handleFavIcon = (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    setFormData((prev) => ({
      ...prev,
      favIcon: file,
    }));

    setFavPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setErrors({});

    setFormError("");

    const validation = systemSettingValidation.safeParse(formData);

    if (!validation.success) {
      setErrors(getValidationErrors(validation.error.issues));
      return;
    }

    try {
      const payload = new FormData();

      payload.append("companyName", formData.companyName);
      payload.append("phoneNumber", formData.phoneNumber);
      payload.append("whtsappNumber", formData.whtsappNumber);
      payload.append("companyEmail", formData.companyEmail);
      payload.append("facebookUrl", formData.facebookUrl);
      payload.append("instagramUrl", formData.instagramUrl);
      payload.append("twitterUrl", formData.twitterUrl);
      payload.append("linkedinUrl", formData.linkedinUrl);

      if (formData.settings) {
        payload.append("settings", formData.settings);
      }

      if (formData.companyLogo) {
        payload.append("companyLogo", formData.companyLogo);
      }

      if (formData.favIcon) {
        payload.append("favIcon", formData.favIcon);
      }

      await onSubmit(payload);
    } catch {
      setFormError("Something went wrong.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {formError && (
        <Alert type="error" icon={<AlertCircle />} title="Validation Error">
          {formError}
        </Alert>
      )}

      {/* Uploads */}

      <div className="grid grid-cols-2 gap-6">
        <div className="rounded-xl border p-5">
          <h3 className="mb-4 font-semibold">Company Logo</h3>

          <div className="flex items-center gap-5">
            <div className="h-24 w-24 overflow-hidden rounded-xl border">
              {logoPreview ? (
                <img src={logoPreview} className="h-full w-full object-cover" />
              ) : (
                <div className="flex h-full items-center justify-center">
                  <Building2 size={34} />
                </div>
              )}
            </div>

            <label className="cursor-pointer rounded-xl border px-5 py-3 hover:bg-muted">
              <Upload size={18} />

              <input
                type="file"
                hidden
                accept="image/*"
                onChange={handleLogo}
              />
            </label>
          </div>
        </div>

        <div className="rounded-xl border p-5">
          <h3 className="mb-4 font-semibold">Favicon</h3>

          <div className="flex items-center gap-5">
            <div className="h-20 w-20 overflow-hidden rounded-xl border">
              {favPreview ? (
                <img src={favPreview} className="h-full w-full object-cover" />
              ) : (
                <div className="flex h-full items-center justify-center">
                  <Globe size={28} />
                </div>
              )}
            </div>

            <label className="cursor-pointer rounded-xl border px-5 py-3 hover:bg-muted">
              <Upload size={18} />

              <input
                hidden
                type="file"
                accept="image/*"
                onChange={handleFavIcon}
              />
            </label>
          </div>
        </div>
      </div>

      {/* Company */}

      <div className="grid grid-cols-2 gap-5">
        <InputField
          label="Company Name"
          name="companyName"
          value={formData.companyName}
          onChange={handleChange}
          error={errors.companyName}
          leftIcon={<Building2 size={18} />}
        />

        <InputField
          label="Company Email"
          name="companyEmail"
          value={formData.companyEmail}
          onChange={handleChange}
          error={errors.companyEmail}
          leftIcon={<Mail size={18} />}
        />

        <InputField
          label="Phone Number"
          name="phoneNumber"
          value={formData.phoneNumber}
          onChange={handleChange}
          error={errors.phoneNumber}
          leftIcon={<Phone size={18} />}
        />

        <InputField
          label="Whatsapp"
          name="whtsappNumber"
          value={formData.whtsappNumber}
          onChange={handleChange}
          error={errors.whtsappNumber}
          leftIcon={<MessageCircle size={18} />}
        />
      </div>

      {/* Social */}

      <div>
        <h3 className="mb-5 text-lg font-semibold">Social Links</h3>

        <div className="grid grid-cols-2 gap-5">
          <InputField
            label="Facebook"
            name="facebookUrl"
            value={formData.facebookUrl}
            onChange={handleChange}
            leftIcon={<Facebook size={18} />}
          />

          <InputField
            label="Instagram"
            name="instagramUrl"
            value={formData.instagramUrl}
            onChange={handleChange}
            leftIcon={<Instagram size={18} />}
          />

          <InputField
            label="Twitter"
            name="twitterUrl"
            value={formData.twitterUrl}
            onChange={handleChange}
            leftIcon={<Twitter size={18} />}
          />

          <InputField
            label="LinkedIn"
            name="linkedinUrl"
            value={formData.linkedinUrl}
            onChange={handleChange}
            leftIcon={<Linkedin size={18} />}
          />
        </div>
      </div>

      {/* Settings */}

      <div>
        <label className="mb-2 block font-semibold">Settings (JSON)</label>

        <textarea
          rows={8}
          name="settings"
          value={formData.settings}
          onChange={handleChange}
          className="w-full rounded-xl border bg-background p-4 outline-none"
          placeholder='{"theme":"blue","maintenance":false}'
        />
      </div>

      <div className="flex justify-end gap-3 border-t pt-6">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>

        <Button type="submit">
          {initialData ? "Update Setting" : "Create Setting"}
        </Button>
      </div>
    </form>
  );
}
