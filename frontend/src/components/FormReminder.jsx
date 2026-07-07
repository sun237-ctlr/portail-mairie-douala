export default function FormReminder({ message = "Veuillez vérifier toutes les informations avant de soumettre ce formulaire." }) {
  return (
    <div className="bg-amber-50 border border-amber-200 text-amber-900 rounded-2xl px-4 py-3 mb-5 text-sm shadow-sm">
      <strong className="font-semibold">⚠️ Avant de soumettre :</strong> {message}
    </div>
  );
}
