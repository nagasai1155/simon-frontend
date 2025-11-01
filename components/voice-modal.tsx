"use client"

import { useState } from "react"
import { Mic, Play, Pause, Check, Info } from "lucide-react"
import ConfigModal from "./config-modal"

interface Voice {
  id: string
  name: string
  gender: "male" | "female"
  accent: string
  personality?: string
  sample?: string
  isAvailable: boolean
}

interface VoiceModalProps {
  isOpen: boolean
  onClose: () => void
  onSelect: (voice: Voice) => void
  selectedVoice?: string
}

export default function VoiceModal({ isOpen, onClose, onSelect, selectedVoice }: VoiceModalProps) {
  const [selected, setSelected] = useState<string | undefined>(selectedVoice)
  const [playing, setPlaying] = useState<string | null>(null)

  // Sample voices data
  const voices: Voice[] = [
    {
      id: "v1",
      name: "Emma",
      gender: "female",
      accent: "American",
      personality: "Friendly",
      sample: "/samples/emma.mp3",
      isAvailable: true,
    },
    {
      id: "v2",
      name: "Alex",
      gender: "male",
      accent: "American",
      personality: "Professional",
      sample: "/samples/alex.mp3",
      isAvailable: true,
    },
    {
      id: "v3",
      name: "Sophia",
      gender: "female",
      accent: "British",
      personality: "Formal",
      sample: "/samples/sophia.mp3",
      isAvailable: true,
    },
    {
      id: "v4",
      name: "James",
      gender: "male",
      accent: "Australian",
      personality: "Casual",
      sample: "/samples/james.mp3",
      isAvailable: true,
    },
    {
      id: "v5",
      name: "Maria",
      gender: "female",
      accent: "Spanish",
      personality: "Enthusiastic",
      sample: "/samples/maria.mp3",
      isAvailable: false,
    },
  ]

  const handleSelect = (voiceId: string) => {
    setSelected(voiceId)
    setPlaying(null) // Stop any playing sample
  }

  const togglePlaySample = (voiceId: string) => {
    if (playing === voiceId) {
      setPlaying(null)
    } else {
      setPlaying(voiceId)
    }
  }

  const handleSave = () => {
    if (selected) {
      const voice = voices.find((v) => v.id === selected)
      if (voice) {
        onSelect(voice)
        onClose()
      }
    }
  }

  return (
    <ConfigModal isOpen={isOpen} onClose={onClose} title="Choose Voice">
      <div className="space-y-4">
        {/* Voice selection */}
        <div className="space-y-2">
          {voices.map((voice) => (
            <div
              key={voice.id}
              onClick={() => voice.isAvailable && handleSelect(voice.id)}
              className={`flex items-center p-3 rounded-lg border ${
                !voice.isAvailable
                  ? "border-border bg-background opacity-60 cursor-not-allowed"
                  : selected === voice.id
                    ? "border-blue-500 bg-blue-500/10 cursor-pointer"
                    : "border-border bg-background hover:bg-secondary/50 cursor-pointer"
              } transition-colors`}
            >
              <div className="flex-1 flex items-center min-w-0">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500/20 to-purple-500/20 flex items-center justify-center">
                  <Mic className="w-5 h-5 text-blue-400" />
                </div>
                <div className="ml-3 overflow-hidden">
                  <p className="text-sm font-medium text-foreground">{voice.name}</p>
                  <div className="flex items-center flex-wrap">
                    <span className="text-xs text-muted-foreground">{voice.gender === "male" ? "Male" : "Female"}</span>
                    <span className="mx-1 text-muted-foreground">•</span>
                    <span className="text-xs text-muted-foreground">{voice.accent}</span>
                    {voice.personality && (
                      <>
                        <span className="mx-1 text-muted-foreground">•</span>
                        <span className="text-xs text-muted-foreground">{voice.personality}</span>
                      </>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex items-center">
                {voice.sample && voice.isAvailable && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      togglePlaySample(voice.id)
                    }}
                    className="p-2 mr-2 rounded-full bg-secondary hover:bg-secondary/80 transition-colors"
                  >
                    {playing === voice.id ? (
                      <Pause className="w-4 h-4 text-foreground" />
                    ) : (
                      <Play className="w-4 h-4 text-foreground" />
                    )}
                  </button>
                )}

                {selected === voice.id && (
                  <div className="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center">
                    <Check className="w-3.5 h-3.5 text-white" />
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Info text */}
        <div className="flex items-start gap-2 text-xs text-muted-foreground px-1">
          <Info className="w-3.5 h-3.5 text-muted-foreground flex-shrink-0 mt-0.5" />
          <p>Select the voice your AI agent will use during phone calls with leads</p>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3 pt-2">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-secondary hover:bg-secondary/80 rounded-lg text-sm text-foreground transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={!selected}
            className={`px-4 py-2 rounded-lg text-sm text-white transition-colors ${
              selected ? "bg-[#635AFE] hover:bg-[#5048E5]" : "bg-secondary opacity-50 cursor-not-allowed"
            }`}
          >
            Select
          </button>
        </div>
      </div>
    </ConfigModal>
  )
}
