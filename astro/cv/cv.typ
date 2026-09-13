// CV generator. Data comes from dist/cv.json, which Astro emits from
// src/data/resume.ts — the same module the /resume/ page renders from.
//
//   typst compile --root . --font-path cv/fonts cv/cv.typ dist/CV_Bauke_Brenninkmeijer.pdf

#let data = json("/dist/cv.json")

#let ink = rgb("#111111")
#let muted = rgb("#4a4a4a")
#let rule = rgb("#d8d8d8")
#let accent = rgb("#0a0a0a")

#set document(title: data.person.name + " — CV", author: data.person.name)
#set page(paper: "a4", margin: (x: 14mm, y: 13mm))
#set text(font: "Inter", size: 9.5pt, fill: ink, lang: "en")
#set par(justify: false, leading: 0.64em)

#let section(title) = block(above: 16pt, below: 8pt)[
  #text(size: 10.5pt, weight: 700, tracking: 0.08em, upper(title))
  #v(-4pt)
  #line(length: 100%, stroke: 0.5pt + rule)
]

#let sidebar-section(title) = block(above: 15pt, below: 6pt)[
  #text(size: 8pt, weight: 600, tracking: 0.08em, fill: muted, upper(title))
  #v(-4pt)
  #line(length: 100%, stroke: 0.5pt + rule)
]

#let entry(period, heading, subheading, bullets) = block(above: 13pt, below: 0pt, breakable: true)[
  #grid(
    columns: (1fr, auto),
    align: (left + bottom, right + bottom),
    text(size: 9.5pt, weight: 600, heading),
    text(size: 8pt, fill: muted, period),
  )
  #v(-3pt)
  // Keep the role line with the entry heading above it, never orphaned.
  #block(sticky: true, text(size: 9pt, fill: muted, subheading))
  #if bullets.len() > 0 [
    #v(1pt)
    #for b in bullets [
      #grid(
        columns: (7pt, 1fr),
        text(fill: muted, [•]),
        text(size: 9pt, b),
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
    // Icons come from the same path data the website's Icon.astro renders.
    #let icon(name, size: 9pt) = box(
      baseline: 1pt,
      image(
        bytes(
          "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='#5a5a5a'><path d='"
            + data.icons.at(name)
            + "'/></svg>",
        ),
        format: "svg",
        height: size,
      ),
    )
    #block(below: 4pt)[
      #link("mailto:" + data.person.email)[
        #icon("mail") #h(2pt) #text(size: 9pt, data.person.email)
      ]
    ]
    #block[
      #for c in data.contactLinks [
        #link(c.href)[#icon(c.icon, size: 11pt)] #h(5pt)
      ]
    ]

    #sidebar-section("Skills")
    #for group in data.skills {
      block(below: 7pt, breakable: false)[
        #text(size: 8.5pt, weight: 600, fill: muted, group.label)
        #v(-4.5pt)
        #text(size: 9pt, group.value)
      ]
    }

    #sidebar-section("Languages")
    #text(size: 9pt, data.languages)

    #sidebar-section("Certifications")
    #for cert in data.certifications {
      block(below: 6pt, breakable: false)[
        #text(size: 8pt, fill: muted, cert.year + "  ")
        #text(size: 9pt, cert.name)
      ]
    }

    #sidebar-section("Publications")
    #for pub in data.publications {
      block(below: 6pt, breakable: false)[
        #link(pub.href)[#text(size: 9pt, pub.title)]
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
