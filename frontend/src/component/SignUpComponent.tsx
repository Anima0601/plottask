import { useState } from "react";

interface RegisterFormData {
  name: string;
  email: string;
  password: string;
}

interface FunctionData {
  SignUp: (registerFormData: RegisterFormData) => void;
}

const SignUpComponent = ({ SignUp }: FunctionData) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8 rounded-xl border border-slate-200 bg-white p-8 shadow-sm">
        {/* Header Block */}
        <div className="text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-lg bg-indigo-600 text-white font-bold text-xl shadow-sm shadow-indigo-200">
            P
          </div>
          <h2 className="mt-6 text-2xl font-bold tracking-tight text-slate-900">
            Create your account
          </h2>
          <p className="mt-2 text-sm text-slate-500">
            Get started with your team's new project workspace.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={(e) => e.preventDefault()} className="mt-8 space-y-6">
          <div className="space-y-4 rounded-md">
            {/* Name Field */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Full Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Jane Doe"
                className="block w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 placeholder-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 sm:text-sm transition-colors"
              />
            </div>

            {/* Email Field */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Work Email Address
              </label>
              <input
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@company.com"
                className="block w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 placeholder-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 sm:text-sm transition-colors"
              />
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="block w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 placeholder-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 sm:text-sm transition-colors"
              />
            </div>
          </div>

          {/* Action Button */}
          <div>
            <button
              onClick={() => SignUp({ name, email, password })}
              type="submit"
              className="group relative flex w-full justify-center rounded-lg bg-indigo-600 px-3 py-2.5 text-sm font-semibold text-white hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 shadow-sm transition-all active:scale-[0.98]"
            >
              Get Started for Free
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SignUpComponent;
