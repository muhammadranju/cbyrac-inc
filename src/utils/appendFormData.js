// utils/appendFormData.js
export function appendFormData(formData, data, parentKey = "") {
  if (!data) return;

  Object.entries(data).forEach(([key, value]) => {
    const formKey = parentKey ? `${parentKey}.${key}` : key;

    if (value instanceof File) {
      // ✅ Directly append File
      formData.append(formKey, value);
    } else if (Array.isArray(value)) {
      // ✅ Handle Arrays
      value.forEach((item, index) => {
        appendFormData(formData, item, `${formKey}[${index}]`);
      });
    } else if (value && typeof value === "object") {
      // ✅ Recursively handle nested objects
      appendFormData(formData, value, formKey);
    } else if (value !== undefined && value !== null) {
      // ✅ Primitive values
      formData.append(formKey, value);
    }
  });

  return formData;
}
