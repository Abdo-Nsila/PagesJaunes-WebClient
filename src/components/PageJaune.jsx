import React, { useState } from "react";
import FilterOptions from "./FilterOptions";
import { processUrls } from "./handleUrlFunctions.js";

const PageJaune = () => {
  const [cards, setCards] = useState([
    // {
    //   card_id: "01516259",
    //   card_url: "https://www.pagesjaunes.fr/pros/01516259#zoneHoraires",
    //   info: {
    //     title: "OFPPT",
    //     activite: "MSMN",
    //     adress: "SYBA, Douar Dlam",
    //     phone: "0909090009",
    //   },
    // },
    // {
    //   card_id: "01516259",
    //   card_url: "https://www.pagesjaunes.fr/pros/01516259#zoneHoraires",
    //   info: {
    //     title: "OFPPT",
    //     activite: "MSMN",
    //     adress: "SYBA, Douar Dlam",
    //     phone: "0909090009",
    //   },
    // },
    // {
    //   card_id: "01516259",
    //   card_url: "https://www.pagesjaunes.fr/pros/01516259#zoneHoraires",
    //   info: {
    //     title: "OFPPT",
    //     activite: "MSMN",
    //     adress: "SYBA, Douar Dlam",
    //     phone: "0909090009",
    //   },
    // },
    // {
    //   card_id: "01516259",
    //   card_url: "https://www.pagesjaunes.fr/pros/01516259#zoneHoraires",
    //   info: {
    //     title: "OFPPT",
    //     activite: "MSMN",
    //     adress: "SYBA, Douar Dlam",
    //     phone: "0909090009",
    //   },
    // },
    // {
    //   card_id: "01516259",
    //   card_url: "https://www.pagesjaunes.fr/pros/01516259#zoneHoraires",
    //   info: {
    //     title: "OFPPT",
    //     activite: "MSMN",
    //     adress: "SYBA, Douar Dlam",
    //     phone: "0909090009",
    //   },
    // },
  ]);
  const [baseUrl, setBaseUrl] = useState({
    url: "",
    filters: {},
  });
  const [showFilters, setShowFilters] = useState(false);

  const scrape = async (client_urls) => {
    // Send the URLs to the server with fetch
    fetch("http://localhost:3090/setup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(client_urls),
    })
      .then((response) => {
        // Start the EventSource connection
        const eventSource = new EventSource("http://localhost:3090/stream");

        eventSource.addEventListener("done", function (event) {
          // Close the connection when the 'done' event is received
          console.log("Received done event, closing connection.");
          eventSource.close();
        });

        // Listen for the 'error' event
        eventSource.addEventListener(
          "failedVerification",
          function (event) {
            const data = JSON.parse(event.data);
            console.log("Verification error", data);
            eventSource.close();
          },
          false
        );

        eventSource.onmessage = function (event) {
          const data = JSON.parse(event.data);
          setCards((prev) => [...prev, data]);
          console.log(data);
        };
        3;
        eventSource.onerror = function (error) {
          console.error("EventSource failed:", error);
          eventSource.close();
        };
      })
      .catch((error) => {
        console.error("Error:", error);
        eventSource.close();
      });
  };

  const onFiltersSubmit = (filters) => {
    setBaseUrl({ ...baseUrl, filters: filters });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!baseUrl.url) {
      console.log("URL is required");
      return;
    } else if (!baseUrl.url.includes("https://www.pagesjaunes.fr/annuaire")) {
      console.log("URL must be from pagesjaunes.fr");
      return;
    }
    // Do something with the URL and other input values, like sending them to an API
    const urls = [
      {
        url: baseUrl.url,
        params: {
          page: baseUrl.filters.startPage,
          tri: baseUrl.filters.sortOption,
        },
        limit: baseUrl.filters.limit,
        genre: baseUrl.filters.genre,
      },
    ];
    console.log(processUrls(urls));
    scrape(processUrls(urls));
    // setBaseUrl({ url: "", filters: {} });
  };

  return (
    <div className="flex flex-col justify-center items-center min-h-screen h-full py-10 bg-gray-800">
      <div className="bg-gray-700 shadow-md rounded px-8 pt-6 pb-8 mb-4 w-2/3 h-auto">
        <div className="mb-4">
          <label
            className="block text-gray-300 text-sm font-bold mb-2"
            htmlFor="url"
          >
            URL
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" // Add the dark mode class
            id="url"
            type="text"
            value={baseUrl.url} // Use the url value from state
            onChange={(e) => setBaseUrl({ ...baseUrl, url: e.target.value })}
            placeholder="Enter URL"
          />
        </div>
        {/*//! --------------------------------------------------------------- */}
        <div className="filters">
          <h4
            onClick={() => setShowFilters((prev) => !prev)}
            className="text-gray-300 text-sm font-bold w-full h-10 flex justify-center items-center border-[1px] border-gray-400 cursor-pointer"
          >
            FILTERS
          </h4>
          <div className={showFilters ? "block" : "hidden"}>
            <FilterOptions
              onFiltersSubmit={onFiltersSubmit}
              url={baseUrl.url}
            />
          </div>
        </div>
        {/*//! --------------------------------------------------------------- */}
        <div className="my-4">
          <button
            onClick={handleSubmit}
            className="w-full bg-yellow-400 hover:bg-yellow-500 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            type="submit"
          >
            Send URL
          </button>
        </div>
      </div>
      <table className="table-auto w-[95%] max-h-[500px] overflow-scroll text-zinc-300 text-center bg-gray-700 rounded">
        <thead>
          <tr>
            <th className="px-4 py-2">Name</th>
            <th className="px-4 py-2">Activity</th>
            <th className="px-4 py-2">Address</th>
            <th className="px-4 py-2">Phone</th>
            <th className="px-4 py-2">URL</th>
          </tr>
        </thead>
        <tbody>
          {cards.map((card, index) => (
            <tr
              key={card.card_id + index}
              className="border-t-2 border-zinc-100"
            >
              <td className="px-4 py-5">{card.info.title}</td>
              <td className="px-4 py-5">{card.info.activite}</td>
              <td className="px-4 py-5">{card.info.adress}</td>
              <td className="">
                {card.info.phone.map((phone, index) => (
                  <div
                    className="px-3 py-2 bg-neutral-900 rounded my-2"
                    key={phone}
                  >
                    {phone}
                  </div>
                ))}
              </td>
              <td className="px-4 py-5">
                <a
                  href={card.card_url}
                  target="_blank"
                  className="btn inline-block w-32 py-3 bg-yellow-400 rounded text-white font-semibold"
                >
                  Visite Card
                </a>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PageJaune;
