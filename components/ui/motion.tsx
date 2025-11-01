"use client"

import type React from "react"

import { motion } from "framer-motion"
import { fadeIn, slideUp, slideRight } from "@/lib/ux-utils"

export const MotionDiv = motion.div
export const MotionUl = motion.ul
export const MotionLi = motion.li

export function FadeIn({
  children,
  delay = 0,
  className = "",
  ...props
}: React.PropsWithChildren<{ delay?: number; className?: string; [key: string]: any }>) {
  return (
    <MotionDiv
      initial="hidden"
      animate="visible"
      exit="exit"
      variants={fadeIn}
      transition={{ delay }}
      className={className}
      {...props}
    >
      {children}
    </MotionDiv>
  )
}

export function SlideUp({
  children,
  delay = 0,
  className = "",
  ...props
}: React.PropsWithChildren<{ delay?: number; className?: string; [key: string]: any }>) {
  return (
    <MotionDiv
      initial="hidden"
      animate="visible"
      exit="exit"
      variants={slideUp}
      transition={{ delay }}
      className={className}
      {...props}
    >
      {children}
    </MotionDiv>
  )
}

export function SlideRight({
  children,
  delay = 0,
  className = "",
  ...props
}: React.PropsWithChildren<{ delay?: number; className?: string; [key: string]: any }>) {
  return (
    <MotionDiv
      initial="hidden"
      animate="visible"
      exit="exit"
      variants={slideRight}
      transition={{ delay }}
      className={className}
      {...props}
    >
      {children}
    </MotionDiv>
  )
}
