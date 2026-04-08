"use client";

import useUser from "@/hooks/useUser";
import { Messages, t } from "@/lib/internationalisation/i18n-helpers";
import createClient from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { useState } from "react";

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
      <button onClick={() => setModalVisible(true)}>
        {t("delete_account", messages)}
      </button>
      {isModalVisible && (
        <div className="fixed inset-0 flex h-screen items-center justify-center bg-black/30">
          <div className="flex w-3/4 max-w-100 flex-col items-center justify-center gap-5 rounded-xl bg-white px-9 py-8 text-center whitespace-pre-line shadow">
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
                  className="w-full rounded-2xl border border-red-100 p-3.75 font-bold text-red-100"
                  onClick={() => setModalVisible(false)}
                >
                  {t("cancel", messages)}
                </button>
                <button
                  className="w-full rounded-2xl border border-red-100 bg-red-100 p-3.75 font-bold text-white"
                  onClick={deleteAccount}
                  disabled={deletionLoading}
                >
                  {t("confirm", messages)}
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
