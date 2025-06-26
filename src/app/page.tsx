import { CheckCircleIcon } from "@heroicons/react/24/solid";
import { LinkIcon } from "@heroicons/react/24/outline";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
      <div className="max-w-4xl mx-auto text-center">
        <div className="mb-8">
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 tracking-tight">
            GetASec
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 mb-8 leading-relaxed">
            One-way meetings made simple
          </p>
        </div>

        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 md:p-12 border border-white/20 shadow-2xl">
          <div className="mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-full mb-6">
              <LinkIcon className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-2xl md:text-3xl font-semibold text-white mb-4">
              Link-Only Access
            </h2>
            <p className="text-gray-300 text-lg leading-relaxed">
              Our meetings are exclusively accessible through shared links. No
              sign-ups, no downloads, no complications.
            </p>
          </div>

          <div className="space-y-4 text-left max-w-2xl mx-auto">
            <div className="flex items-start space-x-3">
              <CheckCircleIcon className="flex-shrink-0 w-6 h-6 text-green-500 mt-1" />
              <p className="text-gray-300">
                Receive a meeting link from the host
              </p>
            </div>
            <div className="flex items-start space-x-3">
              <CheckCircleIcon className="flex-shrink-0 w-6 h-6 text-green-500 mt-1" />
              <p className="text-gray-300">Click to join instantly</p>
            </div>
            <div className="flex items-start space-x-3">
              <CheckCircleIcon className="flex-shrink-0 w-6 h-6 text-green-500 mt-1" />
              <p className="text-gray-300">
                Start your one-way meeting experience
              </p>
            </div>
          </div>
        </div>

        <div className="mt-8 text-gray-400">
          <p className="text-sm">
            Waiting for your meeting invitation? Check your email or messages.
          </p>
        </div>
      </div>
    </div>
  );
}
