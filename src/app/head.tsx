export default function Head() {
  return (
    <>
      <title>Mani Alipour</title>
      <meta name="description" content="Mani Alipour - Developer Portfolio" />

      {/* Disable auto darkening on Android */}
      <meta name="color-scheme" content="light dark" />
      <meta name="supported-color-schemes" content="light dark" />
      <meta name="darkreader-lock" />

      {/* Prevent forced dark mode */}
      <meta name="force-color-adjust" content="none" />

      {/* Viewport */}
      <meta
        name="viewport"
        content="width=device-width, initial-scale=1, maximum-scale=1"
      />
    </>
  );
}
