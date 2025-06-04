"use client";

import { HamburgerMenuIcon, Cross2Icon } from "@radix-ui/react-icons";
import { useState } from "react";
import Link from "next/link";

import { Button } from "@/components/ui/button";

import { navLinks } from "./main-nav";
import { UserNav } from "./user-nav";

export default function HamburgerMenu() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button
        variant="ghost"
        size="icon"
        className="md:hidden"
        onClick={() => setOpen(true)}
      >
        <HamburgerMenuIcon />
        <span className="sr-only">Open menu</span>
      </Button>
      {open && (
        <div className="fixed inset-0 z-50 flex flex-col bg-background animate-in fade-in">
          <div className="flex items-center justify-end px-4 py-3">
            <Button variant="ghost" size="icon" onClick={() => setOpen(false)}>
              <Cross2Icon className="w-5 h-5" />
              <span className="sr-only">Close menu</span>
            </Button>
          </div>
          <div className="flex-1 overflow-y-auto flex flex-col items-center justify-center w-full">
            {navLinks.map((link) => (
              <Link
                href={link.href}
                key={link.href}
                className="flex items-center gap-2 px-4 py-2 rounded-md text-lg font-medium transition-colors w-full justify-center"
              >
                <link.icon className="w-5 h-5" />
                <span className="text-lg font-medium">{link.label}</span>
              </Link>
            ))}
          </div>
          <div className="p-4 border-t">
            <UserNav />
          </div>
        </div>
      )}
    </>
  );
}
