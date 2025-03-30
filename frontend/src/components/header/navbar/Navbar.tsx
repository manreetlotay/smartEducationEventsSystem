import { useState } from "react";
import {
  Dialog,
  DialogPanel,
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
  Popover,
  PopoverButton,
  PopoverGroup,
  PopoverPanel,
} from "@headlessui/react";
import {
  Bars3Icon,
  UserPlusIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import {
  ChevronDownIcon,
  UserIcon,
  ArrowRightEndOnRectangleIcon,
  TicketIcon,
  ClipboardDocumentIcon,
  CalendarIcon,
} from "@heroicons/react/20/solid";

const actionItems = [
  {
    name: "My Tickets",
    description: "Your All-Access Pass to New Experiences",
    href: "/ticket",
    icon: TicketIcon,
  },
  {
    name: "My Events",
    description: "Manage, Edit, and Oversee the Events You've Created",
    href: "/myevents",
    icon: ClipboardDocumentIcon,
  },
];

// callsToAction for no logged in user
const callsToActionWhenNoUser = [
  { name: "Sign In", href: "/signin", icon: UserIcon },
  { name: "Sign up", href: "/signup", icon: UserPlusIcon },
];

// callsToAction for no logged in user
const callsToActionWhenUser = [
  { name: "Sign Out", href: "/", icon: ArrowRightEndOnRectangleIcon },
];

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  // This will be fetched from the database later
  const [userPoints, setUserPoints] = useState(750);
  const [isLoggedIn, setIsLoggedIn] = useState(true); // Temporary state for demo

  // Custom coin SVG icon for the points display
  const CoinIcon = () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      className="w-5 h-5 text-yellow-600"
      fill="currentColor"
    >
      <path d="M12 2C6.486 2 2 6.486 2 12s4.486 10 10 10 10-4.486 10-10S17.514 2 12 2zm0 18c-4.411 0-8-3.589-8-8s3.589-8 8-8 8 3.589 8 8-3.589 8-8 8z" />
      <path d="M12 6c-3.309 0-6 2.691-6 6s2.691 6 6 6 6-2.691 6-6-2.691-6-6-6zm0 10c-2.206 0-4-1.794-4-4s1.794-4 4-4 4 1.794 4 4-1.794 4-4 4z" />
      <path
        d="M12 8c-2.206 0-4 1.794-4 4s1.794 4 4 4 4-1.794 4-4-1.794-4-4-4z"
        fill="#FFD700"
      />
    </svg>
  );

  return (
    <header className="bg-white fixed top-0 left-0 w-full z-50 shadow-md">
      <nav
        aria-label="Global"
        className="mx-auto flex max-w-7xl items-center justify-between p-6 lg:px-8"
      >
        <div className="flex lg:flex-1">
          <a href="/" className="-m-1.5 p-1.5">
            <span className="sr-only">SEES</span>
            <CalendarIcon className="h-8 w-auto text-gray-800" />{" "}
          </a>
        </div>
        <div className="flex lg:hidden">
          <button
            type="button"
            onClick={() => setMobileMenuOpen(true)}
            className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700"
          >
            <span className="sr-only">Open main menu</span>
            <Bars3Icon aria-hidden="true" className="size-6" />
          </button>
        </div>
        <PopoverGroup className="hidden lg:flex lg:gap-x-12">
          <a href="/events" className="text-sm/6 font-semibold text-gray-900">
            Browse Events
          </a>
          <a
            href="createevent"
            className="text-sm/6 font-semibold text-gray-900"
          >
            Create Events
          </a>
        </PopoverGroup>
        <div className="hidden lg:flex lg:flex-1 lg:justify-end lg:items-center">
          {/* Points display */}
          {isLoggedIn && (
            <div className="flex items-center mr-6 px-3 py-1.5 rounded-full h-8">
              <CoinIcon />
              <span className="ml-1.5 text-sm font-semibold text-gray-700">
                {userPoints} points
              </span>
            </div>
          )}

          <Popover className="relative">
            <PopoverButton className="flex items-center gap-x-1 text-sm/6 font-semibold text-gray-900">
              Account
              <ChevronDownIcon
                aria-hidden="true"
                className="size-5 flex-none text-gray-400"
              />
            </PopoverButton>

            <PopoverPanel
              transition
              className="absolute top-full -left-45 z-10 mt-3 w-screen max-w-md overflow-hidden rounded-3xl bg-white ring-1 shadow-lg ring-gray-900/5 transition data-closed:translate-y-1 data-closed:opacity-0 data-enter:duration-200 data-enter:ease-out data-leave:duration-150 data-leave:ease-in"
            >
              {isLoggedIn && (
                <div className="p-4 bg-gradient-to-r from-indigo-50 to-blue-50 border-b border-gray-100">
                  <div className="flex items-center">
                    <div className="flex items-center justify-center bg-white p-2 rounded-full shadow-sm">
                      <CoinIcon />
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium text-gray-700">
                        Create Events. Unlock the Golden Access Pass!
                      </p>
                      <p className="text-xl font-bold text-gray-900">
                        {userPoints}
                      </p>
                    </div>
                  </div>
                  <p className="ml-12 mt-2 text-xs text-gray-500">
                    Each event you create earns you points. Hit 500 and the
                    Golden Access Pass is yours—free entry to any paid event, on
                    us!
                  </p>
                </div>
              )}

              <div className="p-4">
                {actionItems.map((item) => (
                  <div
                    key={item.name}
                    className="group relative flex items-center gap-x-6 rounded-lg p-4 text-sm/6 hover:bg-gray-50"
                  >
                    <div className="flex size-11 flex-none items-center justify-center rounded-lg bg-gray-50 group-hover:bg-white">
                      <item.icon
                        aria-hidden="true"
                        className="size-6 text-gray-600 group-hover:text-indigo-600"
                      />
                    </div>
                    <div className="flex-auto">
                      <a
                        href={item.href}
                        className="block font-semibold text-gray-900"
                      >
                        {item.name}
                        <span className="absolute inset-0" />
                      </a>
                      <p className="mt-1 text-gray-600">{item.description}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-2 divide-x divide-gray-900/5 bg-gray-50">
                {isLoggedIn
                  ? callsToActionWhenUser.map((item) => (
                      <a
                        key={item.name}
                        href={item.href}
                        className="flex items-center justify-center gap-x-2.5 p-3 text-sm/6 font-semibold text-gray-900 hover:bg-gray-100"
                      >
                        <item.icon
                          aria-hidden="true"
                          className="size-5 flex-none text-gray-400"
                        />
                        {item.name}
                      </a>
                    ))
                  : callsToActionWhenNoUser.map((item) => (
                      <a
                        key={item.name}
                        href={item.href}
                        className="flex items-center justify-center gap-x-2.5 p-3 text-sm/6 font-semibold text-gray-900 hover:bg-gray-100"
                      >
                        <item.icon
                          aria-hidden="true"
                          className="size-5 flex-none text-gray-400"
                        />
                        {item.name}
                      </a>
                    ))}
              </div>
            </PopoverPanel>
          </Popover>
        </div>
      </nav>
      <Dialog
        open={mobileMenuOpen}
        onClose={setMobileMenuOpen}
        className="lg:hidden"
      >
        <div className="fixed inset-0 z-10" />
        <DialogPanel className="fixed inset-y-0 right-0 z-10 w-full overflow-y-auto bg-white px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10">
          <div className="flex items-center justify-between">
            <a href="#" className="-m-1.5 p-1.5">
              <span className="sr-only">Your Find My Tickets</span>
              <img
                alt=""
                src="https://tailwindui.com/plus-assets/img/logos/mark.svg?color=indigo&shade=600"
                className="h-8 w-auto"
              />
            </a>
            <button
              type="button"
              onClick={() => setMobileMenuOpen(false)}
              className="-m-2.5 rounded-md p-2.5 text-gray-700"
            >
              <span className="sr-only">Close menu</span>
              <XMarkIcon aria-hidden="true" className="size-6" />
            </button>
          </div>
          <div className="mt-6 flow-root">
            <div className=" divide-y divide-gray-500/10">
              {isLoggedIn && (
                <div className="py-3 px-3 rounded-lg mt-5 flex items-center">
                  <CoinIcon />
                  <span className="ml-2 text-sm font-semibold text-gray-700">
                    {userPoints} points
                  </span>
                </div>
              )}
              <div className="space-y-2">
                <Disclosure as="div" className="-mx-3">
                  <DisclosureButton className="group flex w-full items-center justify-between rounded-lg py-2 pr-3.5 pl-3 text-base/7 font-semibold text-gray-900 hover:bg-gray-50">
                    Account
                    <ChevronDownIcon
                      aria-hidden="true"
                      className="size-5 flex-none group-data-open:rotate-180"
                    />
                  </DisclosureButton>
                  <DisclosurePanel className="mt-2 space-y-2">
                    {[
                      ...actionItems,
                      ...(isLoggedIn
                        ? callsToActionWhenUser
                        : callsToActionWhenNoUser),
                    ].map((item) => (
                      <DisclosureButton
                        key={item.name}
                        as="a"
                        href={item.href}
                        className="block rounded-lg py-2 pr-3 pl-6 text-sm/7 font-semibold text-gray-900 hover:bg-gray-50"
                      >
                        {item.name}
                      </DisclosureButton>
                    ))}
                  </DisclosurePanel>
                </Disclosure>
                <a
                  href="/events"
                  className="-mx-3 block rounded-lg px-3 py-2 text-base/7 font-semibold text-gray-900 hover:bg-gray-50"
                >
                  Browse Events
                </a>
                <a
                  href="#"
                  className="-mx-3 block rounded-lg px-3 py-2 text-base/7 font-semibold text-gray-900 hover:bg-gray-50"
                >
                  Create Events
                </a>
              </div>
            </div>
          </div>
        </DialogPanel>
      </Dialog>
    </header>
  );
}
