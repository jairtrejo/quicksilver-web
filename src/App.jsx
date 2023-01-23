import { useRef, useState } from "react";
import useSWR from "swr";
import useSWRMutation from "swr/mutation";

function cx(classnames) {
  return classnames.filter((e) => e).join(" ");
}

async function getRequest(url) {
  const baseUrl = import.meta.env.VITE_API_BASE_URL;

  let data = null;
  try {
    const response = await fetch(baseUrl + url);
    data = await response.json();
  } catch {
    throw new Error("Backend is not responsive.");
  }

  return data;
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
  const [active, setActive] = useState(new Set());
  const suggestionInput = useRef(null);
  const {
    data = { id: "" },
    trigger: suggestPrompt,
    isMutating,
    error,
  } = useSWRMutation("/prompt", postRequest, { throwOnError: false });

  const { data: galleryData } = useSWR("/prompt", getRequest, {
    fallbackData: [],
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
  });

  function submitSuggestion(e) {
    const prompt = suggestionInput.current.value;

    suggestPrompt({ prompt });

    e.preventDefault();
  }

  let latestDate = null;
  if (galleryData.length > 0) {
    latestDate = new Date();
    latestDate.setTime(galleryData[0].usedAt * 1000);
  }

  const gallery = (
    <section className="gallery">
      <h2>
        {latestDate
          ? `${latestDate.getMonth() + 1}/${latestDate.getFullYear()}`
          : null}
      </h2>
      <ul>
        {galleryData.map(({ id, prompt }) => (
          <li key={id}>
            <img
              src={`/images/${id}.jpg`}
              alt={prompt}
              onClick={() => setActive((active) => new Set([...active, id]))}
            />
            <div
              className={cx(["prompt", active.has(id) ? "active" : null])}
              onClick={() =>
                setActive(
                  (active) => new Set([...active].filter((a) => a !== id))
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
        {galleryData.length > 0 ? gallery : null}
      </main>
    </>
  );
}

export default App;
