export default function Unauthorized() {
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-3xl font-bold mb-4 text-red-600">Access Denied</h1>
      <p>You don't have permission to view this page.</p>
    </div>
  );
}
