import { useRef, useState } from "react";
import useSWRMutation from "swr/mutation";

function cx(classnames) {
  return classnames.filter((e) => e).join(" ");
}

async function postRequest(url, { arg }) {
  const baseUrl = import.meta.env.VITE_API_BASE_URL;

  let response;
  try {
    response = await fetch(baseUrl + url, {
      method: "POST",
      body: JSON.stringify(arg),
    });
  } catch {
    throw new Error("Backend is not responsive.");
  }

  if (!response.ok) {
    let message;
    try {
      const responseData = await response.json();
      message = responseData.message;
    } catch {
      message = "Backend is not responsive.";
    }
    throw new Error(message);
  } else {
    return await response.json();
  }
}

function App() {
  const images = [];

  const [active, setActive] = useState(new Set());
  const suggestionInput = useRef(null);
  const {
    data = { id: "" },
    trigger: suggestPrompt,
    isMutating,
    error,
  } = useSWRMutation("/prompt", postRequest, { throwOnError: false });

  function submitSuggestion(e) {
    const prompt = suggestionInput.current.value;

    suggestPrompt({ prompt });

    e.preventDefault();
  }

  const gallery = (
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
  );

  return (
    <>
      <main>
        <h1>Change my avatar</h1>
        <p>
          Suggest a Stable Diffusion prompt to generate me an avatar. Refer to
          me as jairtrejo (one word).
        </p>
        <form action="" onSubmit={submitSuggestion}>
          <input
            id="prompt"
            key={data.id}
            ref={suggestionInput}
            type="text"
            name="prompt"
            placeholder="An oil portrait of jairtrejo in the style of Rembrandt"
          />
          <button disabled={isMutating} type="submit">
            {isMutating ? "Sending..." : "Suggest"}
          </button>
          <p className="status">
            {!isMutating && error ? (
              <>
                <strong>Error:</strong> {error.message}
              </>
            ) : null}
            {data.id && !isMutating && !error
              ? "Thank you for your suggestion!"
              : null}
          </p>
        </form>
        <p>
          One will be picked at random every day an set as{" "}
          <a href="https://hachyderm.io/@jairtrejo">
            my mastodon profile picture.
          </a>
        </p>
        {images.length > 0 ? gallery : null}
      </main>
    </>
  );
}

export default App;
