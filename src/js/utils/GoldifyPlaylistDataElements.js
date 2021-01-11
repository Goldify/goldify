import React from "react";
import { red } from "@material-ui/core/colors";
import RemoveCircleIcon from "@material-ui/icons/RemoveCircle";
import { getSpotifyRedirectURL } from "../utils/GoldifySoloUtils";
import {
  sortableContainer,
  sortableElement,
  sortableHandle,
} from "react-sortable-hoc";

export const DragHandle = sortableHandle(() => (
  <span className="move-row-icon"></span>
));

export const SortableItem = sortableElement(
  ({ listValue, removeTrackItemHandler }) => (
    <tr className="track-data-tr">
      <td className="track-data-td">
        <DragHandle />
      </td>
      <td className="track-data-td">
        <RemoveCircleIcon
          className="goldify-playlist-remove-button"
          style={{ color: red[500] }}
          fontSize="large"
          onClick={() => {
            removeTrackItemHandler(listValue.track);
          }}
        />
      </td>
      <td className="track-data-td">
        <a
          href={getSpotifyRedirectURL("album", listValue.track.album.id)}
          target="_blank"
          rel="noreferrer"
        >
          <img alt="Album Art" src={listValue.track.album.images[0].url} />
        </a>
      </td>
      <td className="track-data-td">
        <a
          href={getSpotifyRedirectURL("track", listValue.track.id)}
          target="_blank"
          rel="noreferrer"
        >
          {listValue.track.name}
        </a>
      </td>
      <td className="track-data-td">
        {listValue.track.album.artists
          .map((artist, index) => {
            return (
              <a
                key={index}
                href={getSpotifyRedirectURL("artist", artist.id)}
                target="_blank"
                rel="noreferrer"
              >
                {artist.name}
              </a>
            );
          })
          .reduce((prev, curr) => [prev, ", ", curr])}
      </td>
    </tr>
  )
);

export const SortableList = sortableContainer(
  ({ goldifyPlaylistData, removeTrackContainerHandler }) => {
    return (
      <tbody className="track-data-tbody">
        {goldifyPlaylistData.map((listValue, index) => (
          <SortableItem
            key={`item-${index}`}
            index={index}
            listValue={listValue}
            removeTrackItemHandler={removeTrackContainerHandler}
          />
        ))}
      </tbody>
    );
  }
);
