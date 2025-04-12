"use client"

import type React from "react"

import { useEffect, useRef } from "react"
import { Input, type InputProps } from "@/components/ui/input"
import { usePathname } from "next/navigation"

interface AutoSelectInputProps extends InputProps {
  /**
   * Priority level for auto-selection when multiple inputs exist on the page
   * Higher numbers have higher priority (default: 0)
   */
  priority?: number

  /**
   * Whether to select all text when focused (default: true)
   */
  selectAllOnFocus?: boolean

  /**
   * Whether to auto-focus this input (default: true)
   */
  autoFocus?: boolean
}

// Global registry to track inputs across the application
type InputRegistry = {
  pathname: string
  inputs: {
    ref: React.RefObject<HTMLInputElement>
    priority: number
  }[]
}

// Initialize the registry
const inputRegistry: InputRegistry = {
  pathname: "",
  inputs: [],
}

export function AutoSelectInput({
  priority = 0,
  selectAllOnFocus = true,
  autoFocus = true,
  ...props
}: AutoSelectInputProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const pathname = usePathname()

  // Register this input when component mounts
  useEffect(() => {
    if (!autoFocus) return

    // If pathname changed, clear the registry
    if (inputRegistry.pathname !== pathname) {
      inputRegistry.pathname = pathname
      inputRegistry.inputs = []
    }

    // Add this input to the registry
    inputRegistry.inputs.push({
      ref: inputRef as React.RefObject<HTMLInputElement>,
      priority,
    })

    // Sort inputs by priority (highest first)
    inputRegistry.inputs.sort((a, b) => b.priority - a.priority)

    // Focus the highest priority input
    const highestPriorityInput = inputRegistry.inputs[0]
    if (highestPriorityInput && highestPriorityInput.ref === inputRef) {
      // Small delay to ensure the DOM is fully rendered
      setTimeout(() => {
        if (inputRef.current) {
          inputRef.current.focus()
          if (selectAllOnFocus) {
            inputRef.current.select()
          }
        }
      }, 100)
    }

    // Cleanup function to remove this input from registry when unmounted
    return () => {
      inputRegistry.inputs = inputRegistry.inputs.filter((input) => input.ref !== inputRef)
    }
  }, [pathname, priority, autoFocus, selectAllOnFocus])

  // Handle click to select all text if configured
  const handleClick = (e: React.MouseEvent<HTMLInputElement>) => {
    if (selectAllOnFocus && inputRef.current) {
      inputRef.current.select()
    }
    props.onClick?.(e)
  }

  return <Input ref={inputRef} onClick={handleClick} {...props} />
}
