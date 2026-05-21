const SnacksPreference = () => {
  return (
    <div className="p-4 bg-white rounded-lg shadow-sm border">
      <h3 className="text-lg font-semibold mb-3 text-gray-800">Snacks Preference</h3>

      <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
        Snacks preference is managed by the mess committee in the current backend.
        There is no self-service API for updating it yet, so this panel is read-only.
      </div>
    </div>
  );
};

export default SnacksPreference;
