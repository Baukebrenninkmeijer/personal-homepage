// CV generator. Data comes from dist/cv.json, which Astro emits from
// src/data/resume.ts — the same module the /resume/ page renders from.
//
//   typst compile --root . --font-path cv/fonts cv/cv.typ dist/CV_Bauke_Brenninkmeijer.pdf

#let data = json("/dist/cv.json")

#let ink = rgb("#111111")
#let muted = rgb("#5a5a5a")
#let rule = rgb("#d8d8d8")
#let accent = rgb("#0a0a0a")

#set document(title: data.person.name + " — CV", author: data.person.name)
#set page(paper: "a4", margin: (x: 14mm, y: 13mm))
#set text(font: "Inter", size: 9pt, fill: ink, lang: "en")
#set par(justify: false, leading: 0.58em)

#let section(title) = block(above: 12pt, below: 6pt)[
  #text(size: 9pt, weight: 600, tracking: 0.08em, upper(title))
  #v(-4pt)
  #line(length: 100%, stroke: 0.5pt + rule)
]

#let sidebar-section(title) = block(above: 11pt, below: 5pt)[
  #text(size: 8pt, weight: 600, tracking: 0.08em, fill: muted, upper(title))
]

#let entry(period, heading, subheading, bullets) = block(above: 9pt, below: 0pt, breakable: true)[
  #grid(
    columns: (1fr, auto),
    align: (left + bottom, right + bottom),
    text(size: 9.5pt, weight: 600, heading),
    text(size: 8pt, fill: muted, period),
  )
  #v(-3pt)
  // Keep the role line with the entry heading above it, never orphaned.
  #block(sticky: true, text(size: 8.5pt, fill: muted, subheading))
  #if bullets.len() > 0 [
    #v(1pt)
    #for b in bullets [
      #grid(
        columns: (7pt, 1fr),
        text(fill: muted, [•]),
        text(size: 8.5pt, b),
      )
      #v(1.5pt)
    ]
  ]
]

// Header spans both columns.
#block[
  #text(size: 20pt, weight: 600, data.person.name)
  #v(-6pt)
  #text(size: 10pt, fill: muted, data.person.title + " · " + data.person.location)
]

#v(4pt)

#grid(
  columns: (1fr, 62mm),
  column-gutter: 9mm,

  // ---- main column ----
  [
    #text(size: 9pt, data.summary)

    #section("Experience")
    #for job in data.experience {
      entry(job.period, job.company, job.role, job.bullets)
    }

    #section("Education")
    #for school in data.education {
      entry(school.period, school.company, school.role, school.bullets)
    }
  ],

  // ---- sidebar ----
  [
    #sidebar-section("Contact")
    #let contact-line(label, target) = block(below: 3pt)[
      #link(target)[#text(size: 8.5pt, label)]
    ]
    #contact-line(data.person.email, "mailto:" + data.person.email)
    #for c in data.contactLinks {
      contact-line(c.label, c.href)
    }

    #sidebar-section("Skills")
    #for group in data.skills {
      block(below: 5pt)[
        #text(size: 8pt, weight: 600, fill: muted, group.label)
        #v(-4pt)
        #text(size: 8.5pt, group.value)
      ]
    }

    #sidebar-section("Languages")
    #text(size: 8.5pt, data.languages)

    #sidebar-section("Certifications")
    #for cert in data.certifications {
      block(below: 4pt)[
        #text(size: 8pt, fill: muted, cert.year + "  ")
        #text(size: 8.5pt, cert.name)
      ]
    }

    #sidebar-section("Publications")
    #for pub in data.publications {
      block(below: 4pt)[
        #link(pub.href)[#text(size: 8.5pt, pub.title)]
        #v(-4pt)
        #text(size: 8pt, fill: muted, pub.venue + " · " + pub.year)
      ]
    }
  ],
)

// The page budget is part of the document, not a note in a README: overrun
// fails the build instead of quietly shipping a three-page CV.
#context assert(
  counter(page).final().first() <= 2,
  message: "CV runs to " + str(counter(page).final().first()) + " pages; the budget is 2.",
)
