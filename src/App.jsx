import { useState } from "react";

function cx(classnames) {
  return classnames.filter((e) => e).join(" ");
}

function App() {
  const images = [
    {
      url: "sample.jpg",
      prompt: "A picture of jairtrejo in the style of rembrandt",
    },
    {
      url: "sample.jpg",
      prompt: "A picture of jairtrejo in the style of rembrandt",
    },
    {
      url: "sample.jpg",
      prompt: "A picture of jairtrejo in the style of rembrandt",
    },
    {
      url: "sample.jpg",
      prompt: "A picture of jairtrejo in the style of rembrandt",
    },
  ];

  const [active, setActive] = useState(new Set());

  return (
    <>
      <main>
        <h1>Change my avatar</h1>
        <p>
          Suggest a Stable Diffusion prompt to generate me an avatar. Refer to
          me as jairtrejo (one word).
        </p>
        <form action="">
          <input
            id="prompt"
            type="text"
            name="prompt"
            placeholder="An oil portrait of jairtrejo in the style of Rembrandt"
          />
          <button type="submit">Suggest</button>
        </form>
        <p>
          One will be picked at random every day an set as{" "}
          <a href="https://hachyderm.io/@jairtrejo">
            my mastodon profile picture.
          </a>
        </p>
        <section className="gallery">
          <h2>January, 2023</h2>
          <ul>
            {images.map(({ url, prompt }, i) => (
              <li key={i}>
                <img
                  src={url}
                  alt={prompt}
                  onClick={() => setActive((active) => new Set([...active, i]))}
                />
                <div
                  className={cx(["prompt", active.has(i) ? "active" : null])}
                  onClick={() =>
                    setActive(
                      (active) => new Set([...active].filter((a) => a !== i))
                    )
                  }
                >
                  <p>{prompt}</p>
                </div>
              </li>
            ))}
          </ul>
        </section>
      </main>
    </>
  );
}

export default App;
