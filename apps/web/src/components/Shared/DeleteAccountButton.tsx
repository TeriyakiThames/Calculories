"use client";

import useUser from "@/hooks/useUser";
import { Messages, t } from "@/lib/internationalisation/i18n-helpers";
import createClient from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Popup from "./Popup";

export default function DeleteAccountButton({
  messages,
}: {
  messages: Messages;
}) {
  const { user, loading } = useUser();
  const supabase = createClient();
  const router = useRouter();
  const [isModalVisible, setModalVisible] = useState(false);
  const [deletionLoading, setDeletionLoading] = useState(false);

  async function deleteAccount() {
    try {
      setDeletionLoading(true);
      if (!user) throw new Error("No user");

      // call supabase edge function
      const res = await supabase.functions.invoke("user-self-deletion");
      if (res.error) throw res.error;

      // force logout after completing
      await supabase.auth.signOut();
      router.push("/");
      router.refresh();
    } catch (error) {
      alert(t("error_deleting_account", messages));
      console.error(error);
    } finally {
      setDeletionLoading(false);
    }
  }

  if (loading) return null;

  return (
    <div>
      <button
        className="w-full rounded-2xl border border-red-100 px-4 py-5 text-center font-bold text-red-100 hover:cursor-pointer hover:bg-red-100 hover:text-white"
        onClick={() => setModalVisible(true)}
      >
        {t("delete_account", messages)}
      </button>
      {isModalVisible && (
        <Popup onClickOutside={() => setModalVisible(false)}>
          <p className="text-grey-80 font-bold">
            {t("popup_main_message", messages)}
          </p>
          <p className="text-grey-80">
            {t("popup_additional_message", messages)}
          </p>

          {deletionLoading ? (
            <div>loading</div>
          ) : (
            <div className="flex w-full justify-between gap-5">
              <button
                className="hover:bg-grey-10 w-full rounded-2xl border border-red-100 p-2 font-bold text-red-100 hover:cursor-pointer"
                onClick={() => setModalVisible(false)}
              >
                {t("cancel", messages)}
              </button>
              <button
                className="hover:bg-red-80 hover:border-red-80 w-full rounded-2xl border border-red-100 bg-red-100 p-2 font-bold text-white hover:cursor-pointer"
                onClick={deleteAccount}
                disabled={deletionLoading}
              >
                {t("confirm", messages)}
              </button>
            </div>
          )}
        </Popup>
      )}
    </div>
  );
}
