export default function AuthLayout({ title, children }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-black">
      <div className="w-full max-w-md p-8 rounded-2xl bg-white/10 backdrop-blur-lg border border-white/20 shadow-xl">
        
        <h1 className="text-2xl font-bold text-white text-center mb-6">
          {title}
        </h1>

        {children}
      </div>
    </div>
  );
}