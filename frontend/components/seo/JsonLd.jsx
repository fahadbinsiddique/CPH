// Renders a JSON-LD structured-data block. Server-only component so the markup is
// emitted as static HTML in the document. `data` is serialized safely, escaping
// any `</script>` sequence to prevent breaking out of the script element.
const JsonLd = ({ data }) => {
  const json = JSON.stringify(data).replace(/</g, '\\u003c')
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: json }}
    />
  )
}

export default JsonLd