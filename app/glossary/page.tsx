"use client"

import React, { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Search, Volume2, BookOpen, Filter, Baby } from "lucide-react"

interface GlossaryTerm {
  id: string
  term: string
  definition: string
  simpleDefinition: string
  category: string
  relatedTerms: string[]
  pronunciation?: string
}

export default function GlossaryPage() {
  const [terms, setTerms] = useState<GlossaryTerm[]>([])
  const [filteredTerms, setFilteredTerms] = useState<GlossaryTerm[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [selectedLetter, setSelectedLetter] = useState("All")
  const [isSimpleMode, setIsSimpleMode] = useState(false)

  const categories = ["All", "Devices", "Fabrication", "Logic Design", "Materials", "Physics"]
  const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("")

  useEffect(() => {
    // Mock data - in real app, fetch from API
    const mockTerms: GlossaryTerm[] = [
      {
        id: "1",
        term: "Avalanche Breakdown",
        definition:
          "A phenomenon where carriers in a reverse-biased diode gain enough energy to free additional carriers, leading to a sudden increase in current.",
        simpleDefinition: "Sudden current jump in a diode due to high voltage.",
        category: "Physics",
        relatedTerms: ["Zener Diode, Reverse Bias, Breakdown Voltage"],
      },
      {
        id: "2",
        term: "Active Region",
        definition:
          "The part of a transistor where current flows between emitter and collector.",
        simpleDefinition:
          "The working area of a transistor.",
        category: "Devices",
        relatedTerms: ["Emitter, Base, Collector"],
      },
      {
        id: "3",
        term: "Anisotropic Etching",
        definition:
          "A directional etching process that removes material at different rates depending on direction.",
        simpleDefinition: "A chip-cutting method that’s not uniform in all directions.",
        category: "Fabrication",
        relatedTerms: ["Lithography", "Photolithography", "Mask (Photomask)", "Metallization"],
      },
      {
        id: "4",
        term: "Bandgap",
        definition: "The energy difference between the valence band and conduction band in a semiconductor material.",
        simpleDefinition: "The amount of energy needed to make electrons jump and create electricity in a material.",
        category: "Physics",
        relatedTerms: ["Bandgap", "Electric Field", "Electron Mobility", "Hole (in semiconductor)"],
      },
      {
        id: "5",
        term: "Bipolar Junction Transistor (BJT)",
        definition:
          "A transistor using both electron and hole charge carriers. It has three regions: emitter, base, and collector.",
        simpleDefinition: "A transistor that controls current using both types of charge.",
        category: "Devices",
        relatedTerms: ["Active Region", "Emitter", "Collector", "Base"],
      },
      {
        id: "6",
        term: "Bohr Radius",
        definition:
          "The average distance between an electron and the nucleus in a hydrogen atom.",
        simpleDefinition: "A basic physics length for electrons.",
        category: "Physics",
        relatedTerms: ["Ionization Energy", "Kelvin Probe", "Moore’s Law", "Quantum Tunneling"],
      },
      {
        id: "7",
        term: "CMOS (Complementary Metal-Oxide-Semiconductor)",
        definition:
          "A technology used in microchips that uses both p-type and n-type MOSFETs to reduce power usage.",
        simpleDefinition: "A power-efficient chip design using paired transistors.",
        category: "Logic Design",
        relatedTerms: ["CMOS", "Flip-Flop", "Karnaugh Map", "VLSI",],
      },
      {
        id: "8",
        term: "Capacitance",
        definition:
          "The ability of a system to store electrical charge.",
        simpleDefinition: "How much electric charge something can hold.",
        category: "Devices",
        relatedTerms: ["Gate (in MOSFET)", "Drain (MOSFET)", "Zener Diode", "JFET"],
      },
      {
        id: "9",
        term: "Chemical Vapor Deposition (CVD)",
        definition:
          "A process for forming solid materials from gaseous chemicals onto a wafer.",
        simpleDefinition: "A way to coat chips with materials from gas.",
        category: "Fabrication",
        relatedTerms: ["Metallization", "Passivation", "Diffusion", "Ion Implantation"],
      },
      {
        id: "10",
        term: "Critical Dimension (CD)",
        definition:
          "The smallest feature size that can be reliably manufactured on a chip.",
        simpleDefinition: "The tiniest pattern a chip tool can draw.",
        category: "Fabrication",
        relatedTerms: ["Chemical Vapor Deposition (CVD)", "Lithography", "Photolithography"],
      },
      {
        id: "11",
        term: "Current Mirror",
        definition:
          "A circuit that copies current from one branch to another.",
        simpleDefinition: "A design that duplicates current flow.",
        category: "Logic Design",
        relatedTerms: ["Flip-Flop", "Karnaugh Map", "VLSI", "Inverter"],
      },
      {
        id: "12",
        term: "Doping",
        definition:
          "The process of intentionally adding impurities to a semiconductor to change its electrical properties.",
        simpleDefinition: "Adding chemicals to a chip material to improve conduction.",
        category: "Fabrication",
        relatedTerms: ["Etch Stop Layer", "Planar Process", "Plasma Etching", "Process Node"],
      },
      {
        id: "13",
        term: "Depletion Region",
        definition:
          "The area around a p-n junction where no free charge carriers exist.",
        simpleDefinition: "The barrier zone in a diode.",
        category: "Devices",
        relatedTerms: ["Drain (MOSFET)", "Zener Diode", "JFET", "Floating Gate"],
      },
      {
        id: "14",
        term: "Die",
        definition:
          "An individual semiconductor chip sliced from a wafer.",
        simpleDefinition: "A single chip from a batch.",
        category: "Fabrication",
        relatedTerms: ["Etch Stop Layer", "Planar Process", "Plasma Etching", "Process Node"],
      },
      {
        id: "15",
        term: "Diffusion",
        definition:
          "The movement of atoms within a semiconductor during doping.",
        simpleDefinition: "Atoms spreading through a chip to change its traits.",
        category: "Fabrication",
        relatedTerms: ["Die", "Yield", "Critical Dimension", "X-ray Lithography"],
      },
      {
        id: "16",
        term: "Drain (MOSFET)",
        definition:
          "The terminal where current exits a MOSFET.",
        simpleDefinition: "The output side of a transistor.",
        category: "Devices",
        relatedTerms: ["PN Junction", "IC", "Ohmic Contact", "Leakage Current"],
      },
      {
        id: "17",
        term: "Epitaxy",
        definition:
          "A method for growing a crystalline layer on a substrate crystal for semiconductor fabrication.",
        simpleDefinition: "Growing a new layer on a chip base to make it work better.",
        category: "Fabrication",
        relatedTerms: ["Chemical Vapor Deposition (CVD)", "Lithography", "Photolithography", "Mask (Photomask)"],
      },
      {
        id: "18",
        term: "Electric Field",
        definition:
          "A field that exerts force on charges, crucial in semiconductors.",
        simpleDefinition: "A force zone for charged particles.",
        category: "Physics",
        relatedTerms: ["Kelvin Probe", "Moore’s Law", "Quantum Tunneling", "Quantum Dot"],
      },
      {
        id: "19",
        term: "Electron Mobility",
        definition:
          "The ease with which electrons move through a material.",
        simpleDefinition: "How freely electrons can move.",
        category: "Physics",
        relatedTerms: ["Recombination", "Avalanche Breakdown", "Field Effect", "Bohr Radius"],
      },
      {
        id: "20",
        term: "Emitter",
        definition:
          "The part of a BJT that emits charge carriers.",
        simpleDefinition: "Where the current starts in a BJT.",
        category: "Devices",
        relatedTerms: ["Threshold Voltage", "Resistor", "Latch-up"],
      },
      {
        id: "21",
        term: "Etch Stop Layer",
        definition:
          "A layer used to stop etching at a certain depth.",
        simpleDefinition: "A protective layer to control chip cutting.",
        category: "Fabrication",
        relatedTerms: ["Planar Process", "Plasma Etching", "Process Node", "Die"],
      },
      {
        id: "22",
        term: "Fab (Fabrication Plant)",
        definition:
          "A manufacturing facility where semiconductor devices are produced.",
        simpleDefinition: "A factory that makes microchips.",
        category: "Fabrication",
        relatedTerms: [ "X-ray Lithography", "Half Pitch", "Fab", "Oxidation"],
      },
      {
        id: "23",
        term: "Field Effect",
        definition:
          "The control of electrical behavior using an electric field.",
        simpleDefinition: "Controlling current with an invisible force.",
        category: "Physics",
        relatedTerms: ["Field Effect", "Bohr Radius", "Hall Effect"],
      },
      {
        id: "24",
        term: "Flip-Flop",
        definition:
          "A circuit that stores one bit of data.",
        simpleDefinition: "A one-bit memory switch.",
        category: "Logic Design",
        relatedTerms: ["Karnaugh Map", "VLSI", "Inverter", "Gate Delay"],
      },
      {
        id: "25",
        term: "Floating Gate",
        definition:
          "A gate in flash memory that stores charge for data.",
        simpleDefinition: "A charge-storage part in flash chips.",
        category: "Devices",
        relatedTerms: ["Ohmic Contact", "Leakage Current", "Threshold Voltage", "Resistor"],
      },
      {
        id: "26",
        term: "GaAs (Gallium Arsenide)",
        definition:
          "A compound semiconductor used for high-speed devices.",
        simpleDefinition: "A chip material faster than silicon.",
        category: "Materials",
        relatedTerms: ["Ultrapure Silicon", "Low-k Dielectric", "N-type Semiconductor", "GaAs (Gallium Arsenide)"],
      },
      {
        id: "27",
        term: "Gate Oxide",
        definition:
          "The insulating layer between the gate and channel in a MOSFET.",
        simpleDefinition: "A super-thin insulator in transistors.",
        category: "Devices",
        relatedTerms: ["Drain (MOSFET)", "Zener Diode", "JFET", "Floating Gate"],
      },
      {
        id: "28",
        term: "Gate Delay",
        definition:
          "The time taken for a logic gate to respond.",
        simpleDefinition: "How long a logic switch takes to work.",
        category: "Logic Design",
        relatedTerms: ["Inverter", "Gate Delay", "Noise Margin", "Current Mirror"],
      },
      {
        id: "29",
        term: "Gate (in MOSFET)",
        definition:
          "A control terminal that regulates the current flow in a transistor.",
        simpleDefinition: "The control switch in a transistor.",
        category: "Devices",
        relatedTerms: ["Drain (MOSFET)", "Zener Diode", "JFET"],
      },
      {
        id: "30",
        term: "Hole (in semiconductor)",
        definition:
          "A vacancy left by an electron in a semiconductor, acting like a positive charge carrier.",
        simpleDefinition: "The spot an electron leaves, which acts like a positive charge.",
        category: "Physics",
        relatedTerms: ["Electron Mobility", "Ionization Energy", "Kelvin Probe"],
      },
      {
        id: "31",
        term: "Half Pitch",
        definition:
          "Half the distance between identical features in a pattern.",
        simpleDefinition: "Half the space between two tiny chip lines.",
        category: "Fabrication",
        relatedTerms: ["Passivation", "Diffusion", "Ion Implantation", "Overetching"],
      },
      {
        id: "32",
        term: "Hall Effect",
        definition:
          "A voltage generated perpendicular to current and magnetic field in a conductor.",
        simpleDefinition: "A trick to measure magnetic fields in chips.",
        category: "Physics",
        relatedTerms: ["Avalanche Breakdown", "Field Effect", "Bohr Radius"],
      },
      {
        id: "33",
        term: "IC (Integrated Circuit)",
        definition:
          "A complete circuit embedded in a small chip.",
        simpleDefinition: "A tiny chip with many electronic parts inside.",
        category: "Devices",
        relatedTerms: ["Gate (in MOSFET)", "Drain (MOSFET)", "Zener Diode", "JFET"],
      },
      {
        id: "34",
        term: "Inverter",
        definition:
          "A circuit that flips the input signal (1 to 0, 0 to 1).",
        simpleDefinition: "A signal flipper.",
        category: "Logic Design",
        relatedTerms: ["CMOS", "Flip-Flop", "Karnaugh Map", "VLSI"],
      },
      {
        id: "35",
        term: "Ionization Energy",
        definition:
          "The energy required to remove an electron from an atom.",
        simpleDefinition: "The push needed to free an electron.",
        category: "Physics",
        relatedTerms: ["Bandgap", "Electric Field", "Electron Mobility", "Hole (in semiconductor)"],
      },
      {
        id: "36",
        term: "Ion Implantation",
        definition:
          "A technique for introducing dopants into a semiconductor by bombarding it with ions.",
        simpleDefinition: "Shooting atoms into a chip to change its properties.",
        category: "Fabrication",
        relatedTerms: ["Mask (Photomask)", "Metallization", "Passivation", "Diffusion"],
      },
      {
        id: "37",
        term: "Junction",
        definition:
          "The boundary between p-type and n-type semiconductor materials.",
        simpleDefinition: "Where two differently charged regions of a chip meet.",
        category: "Devices",
        relatedTerms: ["PN Junction", "IC", "Ohmic Contact", "Leakage Current"],
      },
      {
        id: "38",
        term: "JFET (Junction Field-Effect Transistor)",
        definition:
          "A type of FET where current is controlled by a voltage applied to the gate.",
        simpleDefinition: "A voltage-controlled transistor.",
        category: "Devices",
        relatedTerms: ["Ohmic Contact", "Leakage Current", "Threshold Voltage"],
      },
      {
        id: "39",
        term: "Karnaugh Map",
        definition:
          "A visual method for simplifying Boolean expressions.",
        simpleDefinition: "A shortcut to design simpler circuits.",
        category: "Logic Design",
        relatedTerms: ["VLSI", "Inverter", "Gate Delay", "Noise Margin"],
      },
      {
        id: "40",
        term: "Kelvin Probe",
        definition:
          "A non-contact method to measure the work function of surfaces, often used in semiconductor analysis.",
        simpleDefinition: "A tool to check surface charge without touching the chip.",
        category: "Physics",
        relatedTerms: ["Moore’s Law", "Quantum Tunneling", "Quantum Dot", "Recombination"],
      },
      {
        id: "41",
        term: "Lithography",
        definition:
          "A technique used to transfer patterns onto a semiconductor wafer during manufacturing.",
        simpleDefinition: "A process to draw tiny circuits on a chip.",
        category: "Fabrication",
        relatedTerms: ["Photolithography", "Mask (Photomask)", "Metallization", "Passivation"],
      },
      {
        id: "42",
        term: "Latch-up",
        definition:
          "A condition where a circuit enters a high current state and won’t reset.",
        simpleDefinition: "A stuck circuit that overheats.",
        category: "Devices",
        relatedTerms: ["IC", "Ohmic Contact", "Leakage Current", "Threshold Voltage"],
      },
      {
        id: "43",
        term: "Leakage Current",
        definition:
          "Unwanted small current that flows when a device is off.",
        simpleDefinition: "Power lost even when off.",
        category: "Devices",
        relatedTerms: ["IC", "Ohmic Contact","Bipolar Junction Transistor (BJT)" , "Threshold Voltage"],
      },
      {
        id: "44",
        term: "Low-k Dielectric",
        definition:
          "A material with low permittivity used to reduce capacitance in chips.",
        simpleDefinition: "Insulator that reduces signal delay.	",
        category: "Materials",
        relatedTerms: ["Silicon", "Ultrapure Silicon", "Low-k Dielectric", "N-type Semiconductor"],
      },
      {
        id: "45",
        term: "Mask (Photomask)",
        definition:
          "A stencil used in photolithography to create circuit patterns.",
        simpleDefinition: "A stencil to draw circuits.",
        category: "Fabrication",
        relatedTerms: ["Yield", "Critical Dimension", "X-ray Lithography", "Half Pitch"],
      },
      {
        id: "46",
        term: "Metallization",
        definition:
          "The process of adding metal layers to connect circuit components.",
        simpleDefinition: "Adding metal roads on chips.",
        category: "Fabrication",
        relatedTerms: ["Yield", "Critical Dimension", "X-ray Lithography", "Half Pitch"],
      },
      {
        id: "47",
        term: "Moore’s Law",
        definition:
          "The observation that transistor count on chips doubles about every 2 years.",
        simpleDefinition: "Chips get twice as powerful every few years.",
        category: "Physics",
        relatedTerms: [ "Recombination", "Avalanche Breakdown", "Field Effect", "Bohr Radius"],
      },
      {
        id: "48",
        term: "Noise Margin",
        definition:
          "The maximum noise a logic signal can tolerate before malfunctioning.",
        simpleDefinition: "How much noise a chip signal can handle.",
        category: "Logic Design",
        relatedTerms: ["CMOS", "Flip-Flop", "Karnaugh Map", "VLSI", "Inverter"],
      },
      {
        id: "49",
        term: "N-type Semiconductor",
        definition:
          "A semiconductor doped with elements that provide extra electrons.",
        simpleDefinition: "A material where current is mostly due to electrons.",
        category: "Materials",
        relatedTerms: ["Ultrapure Silicon", "Low-k Dielectric"],
      },
      {
        id: "50",
        term: "Oxidation",
        definition:
          "The process of forming an oxide layer (like SiO₂) on a semiconductor surface.",
        simpleDefinition: "Adding a thin glass-like layer to a chip.",
        category: "Fabrication",
        relatedTerms: ["Lithography", "Photolithography", "Mask (Photomask)", "Metallization"],
      },
      {
        id: "51",
        term: " Photolithography",
        definition:
          "A process of using light to transfer patterns onto a wafer.",
        simpleDefinition: "Using light to etch circuits onto a chip.",
        category: "Fabrication",
        relatedTerms: ["Passivation", "Diffusion", "Ion Implantation", "Overetching", "Etch Stop Layer"],
      },
      {
        id: "52",
        term: " Quantum Tunneling",
        definition:
          "A quantum phenomenon where particles pass through barriers they classically shouldn’t.",
        simpleDefinition: "Electrons sneaking through barriers in chips.",
        category: "Physics",
        relatedTerms: ["Avalanche Breakdown", "Field Effect", "Bohr Radius", "Hall Effect"],
      },
      {
        id: "53",
        term: " Resistor",
        definition:
          "A component that limits the flow of electric current.",
        simpleDefinition: "A part that reduces current in circuits.",
        category: "Devices",
        relatedTerms: ["PN Junction", "IC", "Ohmic Contact", "Leakage Current"],
      },
      {
        id: "54",
        term: "Silicon",
        definition:
          "The base material for most semiconductor devices.",
        simpleDefinition: "The most common chip material.",
        category: "Materials",
        relatedTerms: ["Ultrapure Silicon", "Low-k Dielectric", "N-type Semiconductor", "GaAs (Gallium Arsenide)", "Doping"],
      },
      {
        id: "55",
        term: "Threshold Voltage",
        definition:
          "The voltage needed to turn on a MOSFET.",
        simpleDefinition: "The voltage that activates a transistor.",
        category: "Devices",
        relatedTerms: ["Drain (MOSFET)", "Zener Diode", "JFET", "Floating Gate"],
      },
      {
        id: "56",
        term: "Ultrapure Silicon",
        definition:
          "Silicon purified to extreme levels for semiconductor use.",
        simpleDefinition: "Very clean silicon for making chips.",
        category: "Materials",
        relatedTerms: ["Ultrapure Silicon", "Low-k Dielectric"],
      },
      {
        id: "57",
        term: "VLSI (Very Large-Scale Integration)",
        definition:
          "The process of integrating thousands/millions of transistors on a single chip.",
        simpleDefinition: "Putting tons of circuits onto one chip.",
        category: "Logic Design",
        relatedTerms: ["Semiconductor", "Wafer", "Crystal", "Doping"],
      },
      {
        id: "58",
        term: "Wafer",
        definition:
          "A thin slice of semiconductor used as a base for making chips.",
        simpleDefinition: "A flat disc where chips are built.",
        category: "Fabrication",
        relatedTerms: ["Critical Dimension", "X-ray Lithography"],
      },
      {
        id: "59",
        term: " X-ray Lithography",
        definition:
          "A lithography technique using X-rays for fine feature definition.",
        simpleDefinition: "Using X-rays to make super tiny chip patterns.",
        category: "Fabrication",
        relatedTerms: ["Half Pitch", "Fab", "Oxidation", "Epitaxy"],
      },
      {
        id: "60",
        term: "Yield",
        definition:
          "The ratio of functional chips to total chips produced on a wafer.",
        simpleDefinition: "How many good chips are made from each batch.",
        category: "Fabrication",
        relatedTerms: ["Metallization", "Passivation", "Diffusion", "Ion Implantation", "Overetching"],
      },
      {
        id: "61",
        term: "Zener Diode",
        definition:
          "A special diode that allows current to flow in reverse when a set voltage is reached.",
        simpleDefinition: "A diode that protects circuits by controlling voltage.",
        category: "Devices",
        relatedTerms: ["Gate (in MOSFET)", "Drain (MOSFET)", "Zener Diode", "JFET"],
      },
      {
        id: "62",
        term: "Ohmic Contact",
        definition:
          "A contact that allows current to flow easily in both directions.",
        simpleDefinition: "A good two-way connection for current.",
        category: "Devices",
        relatedTerms: ["Active Region", "Emitter", "Collector"],
      },
      {
        id: "63",
        term: "Overetching",
        definition:
          "Etching longer than needed, possibly damaging the wafer.",
        simpleDefinition: "Cutting too deep while patterning.",
        category: "Fabrication",
        relatedTerms: ["Chemical Vapor Deposition (CVD)", "Lithography"],
      },
      {
        id: "64",
        term: "Passivation",
        definition:
          "Adding a protective layer to prevent contamination or damage.",
        simpleDefinition: "A shield that protects the chip surface.",
        category: "Fabrication",
        relatedTerms: ["Photolithography", "Mask (Photomask)", "Metallization"],
      },
      {
        id: "65",
        term: "Photoresist",
        definition:
          "A light-sensitive material used in photolithography.",
        simpleDefinition: "A light-reactive coating to draw patterns.",
        category: "Fabrication",
        relatedTerms: ["Planar Process", "Plasma Etching", "Process Node"],
      },
      {
        id: "65",
        term: "Planar Process",
        definition:
          "A method where all components are built on the surface of the wafer.",
        simpleDefinition: "A flat way to build chip parts.",
        category: "Fabrication",
        relatedTerms: ["Photolithography", "Mask (Photomask)", "Metallization", "Passivation"],
      },
      {
        id: "66",
        term: "Plasma Etching",
        definition:
          "A dry etching technique using plasma to remove materials.",
        simpleDefinition: "Chip carving with ionized gas.",
        category: "Fabrication",
        relatedTerms: ["Diffusion", "Ion Implantation", "Overetching", "Etch Stop Layer"],
      },
      {
        id: "67",
        term: "PN Junction",
        definition:
          "The interface between p-type and n-type semiconductors.",
        simpleDefinition: "Where positive and negative chip materials meet.",
        category: "Devices",
        relatedTerms: ["IC", "Ohmic Contact", "Leakage Current", "Threshold Voltage"],
      },
      {
        id: "68",
        term: "Process Node",
        definition:
          "The size of features in a semiconductor process, e.g., 7nm, 5nm.",
        simpleDefinition: "How small chip parts are made.",
        category: "Fabrication",
        relatedTerms: ["Critical Dimension", "X-ray Lithography", "Half Pitch"],
      },
      {
        id: "69",
        term: "Quantum Dot",
        definition:
          "A nanostructure that confines electrons in 3D space.",
        simpleDefinition: "A tiny particle that traps electrons.",
        category: "Physics",
        relatedTerms: ["Recombination", "Avalanche Breakdown", "Field Effect", "Bohr Radius"],
      },
      {
        id: "70",
        term: "Recombination",
        definition:
          "When an electron fills a hole, releasing energy.",
        simpleDefinition: "When an electron and hole cancel each other.",
        category: "Physics",
        relatedTerms: ["Ionization Energy", "Kelvin Probe", "Moore’s Law"],
      },
    ]
    setTerms(mockTerms)
    setFilteredTerms(mockTerms)
  }, [])

  useEffect(() => {
    let filtered = terms

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(
        (term) =>
          term.term.toLowerCase().includes(searchQuery.toLowerCase()) ||
          term.definition.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    }

    // Filter by category
    if (selectedCategory !== "All") {
      filtered = filtered.filter((term) => term.category === selectedCategory)
    }

    // Filter by letter
    if (selectedLetter !== "All") {
      filtered = filtered.filter((term) => term.term.charAt(0).toUpperCase() === selectedLetter)
    }

    setFilteredTerms(filtered)
  }, [terms, searchQuery, selectedCategory, selectedLetter])

  const speakTerm = (term: string, pronunciation?: string) => {
    if ("speechSynthesis" in window) {
      const utterance = new SpeechSynthesisUtterance(pronunciation || term)
      utterance.rate = 0.8
      speechSynthesis.speak(utterance)
    }
  }

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold text-white drop-shadow-lg">Semiconductor Glossary</h1>
          <p className="text-xl text-white/90">Master the terminology of semiconductor technology</p>
        </div>

        {/* Controls */}
        <Card className="bg-white/95 backdrop-blur">
          <CardContent className="p-6 space-y-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search terms and definitions..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Filters */}
            <div className="flex flex-wrap gap-4 items-center">
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4" />
                <span className="text-sm font-medium">Category:</span>
                <div className="flex flex-wrap gap-1">
                  {categories.map((category) => (
                    <Button
                      key={category}
                      variant={selectedCategory === category ? "default" : "outline"}
                      size="sm"
                      onClick={() => setSelectedCategory(category)}
                    >
                      {category}
                    </Button>
                  ))}
                </div>
              </div>

              <Button
                variant={isSimpleMode ? "default" : "outline"}
                size="sm"
                onClick={() => setIsSimpleMode(!isSimpleMode)}
                className="flex items-center gap-2"
              >
                <Baby className="h-4 w-4" />
                Explain Like I'm 5
              </Button>
            </div>

            {/* A-Z Navigation */}
            <div className="flex flex-wrap gap-1">
              <Button
                variant={selectedLetter === "All" ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedLetter("All")}
              >
                All
              </Button>
              {alphabet.map((letter) => (
                <Button
                  key={letter}
                  variant={selectedLetter === letter ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedLetter(letter)}
                  className="w-8 h-8 p-0"
                >
                  {letter}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Terms Grid */}
        <div className="grid gap-6">
          {filteredTerms.map((term) => (
            <Card key={term.id} className="bg-white/95 backdrop-blur">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl font-bold text-blue-600">{term.term}</span>
                    {term.pronunciation && <span className="text-sm text-gray-500">/{term.pronunciation}/</span>}
                    <Button variant="ghost" size="sm" onClick={() => speakTerm(term.term, term.pronunciation)}>
                      <Volume2 className="h-4 w-4" />
                    </Button>
                  </div>
                  <Badge variant="secondary">{term.category}</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-gray-700 leading-relaxed">
                    {isSimpleMode ? term.simpleDefinition : term.definition}
                  </p>
                </div>

                {term.relatedTerms.length > 0 && (
                  <div>
                    <h4 className="font-semibold text-sm text-gray-600 mb-2">Related Terms:</h4>
                    <div className="flex flex-wrap gap-2">
                      {term.relatedTerms.map((relatedTerm) => (
                        <Badge key={relatedTerm} variant="outline" className="cursor-pointer hover:bg-gray-100">
                          {relatedTerm}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredTerms.length === 0 && (
          <Card className="bg-white/95 backdrop-blur">
            <CardContent className="text-center py-12">
              <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-600 mb-2">No terms found</h3>
              <p className="text-gray-500">Try adjusting your search or filters</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
