import { Link } from "react-router-dom"
import Discord from "./Components/Discord"

const DISCORD_LINK = "https://discord.gg/mVjjSJNUuf"

const Footer = () => {
    return (
        <footer className="bg-slate-50 border-t">
          <div>
            <div className="pt-6">
              <nav className="text-sm" aria-label="quick links">
                <ul className="flex justify-center space-x-6">
                  <li>
                    <Link to="privacy">
                      <div className="rounded-lg px-2 py-1 text-slate-700 hover:bg-slate-100 hover:text-slate-900">
                        Privacy
                      </div>
                    </Link>
                  </li>
                  <li>
                    <Link to="tos">
                      <div className="rounded-lg px-2 py-1 text-slate-700 hover:bg-slate-100 hover:text-slate-900">
                        Terms of Service
                      </div>
                    </Link>
                  </li>
                  <li>
                    <Link to="contact">
                      <div className="rounded-lg px-2 py-1 text-slate-700 hover:bg-slate-100 hover:text-slate-900">
                        Contact Us
                      </div>
                    </Link>
                  </li>
                </ul>
              </nav>
            </div>
            <div className="flex flex-col items-center border-t border-slate-400/10 pb-2 sm:flex-row-reverse sm:justify-between sm:px-4">
              <div className="flex space-x-6">
                {
                //<Discord link={DISCORD_LINK} />
                }
                </div>
              <p className="mt-3 text-sm text-slate-500 sm:mt-4">
                Copyright &copy; {new Date().getFullYear()} Examify. All rights
                reserved.
              </p>
            </div>
          </div>
        </footer>
    )
}

export default Footer