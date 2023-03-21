import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Avatar, Button, Chip, IconButton, Snackbar } from "@mui/material";
import {
  DeleteOutline,
  Close,
  Edit,
  DoneAll,
  FileDownload,
} from "@mui/icons-material";
import {
  DeleteConfirm,
  AddForm,
  Skeleton,
  MonthSelector,
  EmptyList,
} from "@/components";
import { COLLECTIONS } from "@/constants";
import { useFetch } from "@/hooks";
import { sendStarData } from "@/utils/export-data";
import { capitalize, has_items_in_month } from "@/utils";
import { setAddNewFormVisible, setDeleteVisible } from "@/stores/content";
import type { TFetchData } from "@/hooks/use_fetch";

const Stars = () => {
  const dispatch = useDispatch();
  const { settings, content } = useSelector((state: any) => state);
  const [current_item, setCurrentItem] = useState<TFetchData | null>();
  const [is_download_snackbar_visible, setDownloadSnackbarVisibility] =
    useState(false);
  const [is_loading, items, grouped_items] = useFetch(
    COLLECTIONS.STARS,
    "month",
    settings.list.months
  );

  return (
    <div className="p-10">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center justify-start basis-1/3">
          <h3 className="uppercase text-lg font-bold mr-2">
            Stars of the month
          </h3>
          <Chip
            label={capitalize(settings.date.month)}
            size="small"
            color="primary"
            variant="outlined"
          />
        </div>
        <div className="flex items-center justify-end">
          <MonthSelector />
          <Button
            variant="contained"
            disableElevation
            color="primary"
            size="small"
            className="ml-2"
            onClick={() => {
              setCurrentItem(null);
              dispatch(setAddNewFormVisible(true));
            }}
          >
            Add New
          </Button>
        </div>
      </div>
      <div>
        {is_loading && <Skeleton row={6} />}
        {!is_loading &&
          (!has_items_in_month(items, settings.date.month) ||
            (items && !items.length)) && <EmptyList />}
        {!is_loading &&
          has_items_in_month(items, settings.date.month) &&
          items &&
          items.length &&
          grouped_items[settings.date.month].map((item) => {
            return (
              <div
                key={item.id}
                className="flex items-center justify-between px-4 py-2 border-2 mt-2 rounded-md"
              >
                <div className="flex items-center justify-start">
                  <div className="flex items-center justify-start w-40">
                    <Avatar
                      alt="Star of the month"
                      src={item.image}
                      sx={{ width: 48, height: 48 }}
                      variant="circular"
                    />
                    <div className="ml-4">
                      <h3 className="text-sm font-bold text-black">
                        {item.name}
                      </h3>
                      <span className="text-xs text-zinc-500">
                        {item.slack ? `@${item.slack}` : ""}
                      </span>
                    </div>
                  </div>

                  <div className="ml-4">
                    <h3 className="block uppercase text-xs font-bold text-zinc-400 mb-2">
                      Achievements
                    </h3>
                    <ul>
                      {item.achievements
                        .split(" | ")
                        .map((achievement: string, idx: number) => {
                          return (
                            <li
                              key={idx}
                              className="text-xs text-black mb-1 flex items-center justify-start"
                            >
                              <DoneAll
                                fontSize="small"
                                className="mr-1"
                                color="primary"
                              />
                              {achievement}
                            </li>
                          );
                        })}
                    </ul>
                  </div>
                </div>
                <div>
                  <IconButton
                    aria-label="download"
                    color="primary"
                    size="small"
                    onClick={() => {
                      sendStarData(item, settings.date);
                      setDownloadSnackbarVisibility(true);
                    }}
                  >
                    <FileDownload fontSize="small" />
                  </IconButton>
                  <IconButton
                    aria-label="edit"
                    color="warning"
                    size="small"
                    onClick={() => {
                      setCurrentItem(item);
                      dispatch(setAddNewFormVisible(true));
                    }}
                  >
                    <Edit fontSize="small" />
                  </IconButton>
                  <IconButton
                    aria-label="delete"
                    color="error"
                    size="small"
                    onClick={() => {
                      setCurrentItem(item);
                      dispatch(setDeleteVisible(true));
                    }}
                  >
                    <DeleteOutline fontSize="small" />
                  </IconButton>
                </div>
              </div>
            );
          })}
      </div>

      <Snackbar
        open={is_download_snackbar_visible}
        autoHideDuration={6000}
        onClose={() => setDownloadSnackbarVisibility(false)}
        message="Download Query Added. Check List a few minutes later."
        action={
          <IconButton
            size="small"
            aria-label="close"
            color="inherit"
            onClick={() => setDownloadSnackbarVisibility(false)}
          >
            <Close fontSize="small" />
          </IconButton>
        }
      />

      {content.is_delete_visible && (
        <DeleteConfirm
          item_id={current_item?.id!}
          collection_name={COLLECTIONS.STARS}
        />
      )}
      {content.is_add_new_form_visible && (
        <AddForm item={current_item!} collection={COLLECTIONS.STARS} />
      )}
    </div>
  );
};

export default Stars;
