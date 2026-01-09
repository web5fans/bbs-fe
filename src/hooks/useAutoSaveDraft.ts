import { useRequest } from "ahooks";
import { postsWritesPDSOperation } from "@/app/posts/utils";
import dayjs from "dayjs";
import useCurrentUser from "@/hooks/useCurrentUser";
import { useEffect, useMemo, useRef } from "react";

type DraftParamsType = {
  sectionId: string,
  title: string,
  text: string,
}

export default function useAutoSaveDraft(props: { title: string; editorText: string; sectionId: string }) {
  const { userProfile } = useCurrentUser()

  const draftInfo = useRef<{ uri: string; created: string, savedTime?: string } | undefined>(undefined)

  const editDraft = async (obj: DraftParamsType, editType: 'update' | 'delete' = 'update') => {
    if (!draftInfo.current) return
    const { uri, created } = draftInfo.current
    const rkey = uri.split('/app.bbs.post/')[1]

    const edited = dayjs.utc().format()

    draftInfo.current.savedTime = edited;

    await postsWritesPDSOperation({
      record: {
        $type: 'app.bbs.post',
        section_id: obj.sectionId,
        title: obj.title,
        text: obj.text,
        edited,
        created,
        is_draft: true
      },
      did: userProfile?.did!,
      rkey,
      type: editType
    })
  }

  const { run: runPolling, loading: pollingLoading, cancel: cancelPolling } = useRequest(async () => {
    await editDraft({
      title: props.title,
      text: props.editorText,
      sectionId: props.sectionId
    })
  }, {
    pollingInterval: 30 * 1000,
    manual: true
  });

  const createDraft = async (obj: DraftParamsType) => {
    const result = await postsWritesPDSOperation({
      record: {
        $type: 'app.bbs.post',
        section_id: obj.sectionId,
        title: obj.title,
        text: obj.text,
        is_draft: true
      },
      did: userProfile?.did!
    })
    draftInfo.current = { ...result, savedTime: result.created, uri: result.uri || '' };
    runPolling()
  }

  const { run: runDebounce, loading: debounceLoading } = useRequest(async (obj: DraftParamsType) => {
    if (!draftInfo.current) {
      await createDraft(obj)
      return
    }
    await editDraft(obj)
  }, {
    debounceWait: 1000,
    manual: true
  });

  const loading = useMemo(() => debounceLoading || pollingLoading, [debounceLoading, pollingLoading])

  useEffect(() => {
    return () => {
      cancelPolling()
    }
  }, []);

  return {
    autoSaveDraft: runDebounce,
    deleteDraft: function (obj: DraftParamsType){
      editDraft(obj, 'delete')
    },
    loading,
    updatedTime: draftInfo.current?.savedTime,
    manualSaveDraft: editDraft,
    setDraftInfo: function (info: { uri: string; created: string }){
      draftInfo.current = info
    },
    draftUri: draftInfo.current?.uri
  }
}