import aboutImage from "../assets/5.jpg"
import { User, Users, Rocket, GraduationCap, BookOpen, Bolt, MessageCircle, Lock } from 'lucide-react'

const About = () => {
  return (
    <section className="relative px-4 sm:px-8 lg:px-0 bg-gradient-to-br from-bahia-50 via-white to-purple-50 h-screen w-full overflow-auto">
      <div className="w-full mx-auto dark:bg-dark-background bg-white/90 shadow-xl p-8 md:p-14 text-white">
        <h2 className="text-4xl md:text-5xl font-extrabold mb-6 dark:text-bahia-400 text-bahia-600 drop-shadow text-center">
          About Our Interview Platform
        </h2>
        <div className="flex w-full justify-center items-center p-4">
          <img src={aboutImage}  alt="aboutImage" className="md:h-[400px]"/>
        </div>
        <p className="text-lg md:text-xl leading-relaxed mb-4 dark:text-bahia-50 text-gray-800 text-center">
          <span className="font-semibold dark:text-blue-600 text-blue-700">Welcome!</span> Our Interview Platform is designed to revolutionize the way interviews are conducted in the digital age. Whether you are an interviewer, a candidate, or a mentor, our platform provides a seamless, secure, and user-friendly environment for remote interviews and mock sessions.
        </p>
        <p className="text-lg md:text-xl leading-relaxed mb-8 dark:text-bahia-50  text-gray-800 text-center">
          We leverage cutting-edge technologies like <span className="font-semibold text-blue-700">WebRTC</span> for real-time video and <span className="font-semibold text-purple-700">WebSocket</span> for instant messaging, ensuring every conversation is smooth and interruption-free. Our mission is to help you focus on what matters most: meaningful conversations and skill assessment, not technical hurdles.
        </p>
        <div className="grid grid-cols-1 gap-10 mt-10 dark:text-white text-gray-700">
          <div>
            <h3 className="text-2xl font-semibold mb-4 flex items-center gap-2 text-blue-700 content-around">
              <Bolt className="text-yellow-400" /> Key Benefits
            </h3>
            <ul className="space-y-4">
              <li className="flex items-center gap-3">
                <Lock className="text-green-500" />
                <span>
                  <span className="font-semibold">No sign-up or downloads required:</span> Jump straight into your interview or session from your browser, with no barriers or lengthy registration processes.
                </span>
              </li>
              <li className="flex items-center gap-3">
                <MessageCircle className="text-blue-500" />
                <span>
                  <span className="font-semibold">Real-time video and chat:</span> Experience high-quality video calls and instant messaging, making communication natural and effective.
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Rocket className="text-purple-500" />
                <span>
                  <span className="font-semibold">Fast, secure, and browser-based:</span> Enjoy a platform optimized for speed and privacy, accessible from any modern device.
                </span>
              </li>
              <li className="flex items-center gap-3">
                <GraduationCap className="text-pink-500" />
                <span>
                  <span className="font-semibold">User-friendly design:</span> Our intuitive interface is crafted for users of all backgrounds, from tech-savvy professionals to first-time interviewees.
                </span>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-2xl font-semibold mb-4 flex items-center gap-2 text-purple-700">
              <User className="text-blue-400" /> Built For
            </h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <Users className="text-blue-600 mt-1" />
                <span>
                  <span className="font-semibold">Hiring teams & recruiters:</span> Effortlessly schedule and conduct interviews with candidates from anywhere in the world, streamlining your hiring process.
                </span>
              </li>
              <li className="flex items-start gap-3">
                <Rocket className="text-purple-600 mt-1" />
                <span>
                  <span className="font-semibold">Startups & remote-first companies:</span> Conduct technical and non-technical interviews without worrying about logistics or software compatibility.
                </span>
              </li>
              <li className="flex items-start gap-3">
                <GraduationCap className="text-green-600 mt-1" />
                <span>
                  <span className="font-semibold">Students & job seekers:</span> Practice your interview skills in a realistic environment, receive feedback, and build confidence for your next opportunity.
                </span>
              </li>
              <li className="flex items-start gap-3">
                <BookOpen className="text-yellow-600 mt-1" />
                <span>
                  <span className="font-semibold">Freelancers, mentors & educators:</span> Offer mock interviews, coaching, or training sessions to help others succeed, all within a secure and easy-to-use platform.
                </span>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-12 text-center text-gray-600 text-base md:text-lg">
          <p className="dark:text-bahia-400">
            <span className="font-semibold text-blue-600">Ready to experience the future of interviews?</span> <br />
            Join thousands of users who trust our platform for their most important conversations. <br />
            <span className="italic">No downloads. No hassle. Just great interviews.</span>
          </p>
        </div>
      </div>
    </section>
  )
}

export default About