Feature: Extended markdown rendering

  Scenario: Static export renders the supported content types
    Given a markdown document with markdown, Mermaid, math, SVG, and DOT content
    When the document is rendered in static export mode
    Then the output contains rendered markdown structure
    And the output contains a Mermaid SVG
    And the output contains KaTeX-rendered math
    And the output contains a trusted SVG block
    And the output contains a rendered DOT SVG

  Scenario: Client mode preserves browser-executed placeholders
    Given a markdown document with Mermaid content
    When the document is rendered in client mode
    Then the output contains a Mermaid placeholder
    And the placeholder is marked pending

  Scenario: Unsafe raw content is sanitized
    Given a markdown document with dangerous raw HTML and SVG content
    When the document is rendered in static export mode
    Then dangerous script content is removed
    And dangerous event handler attributes are removed
