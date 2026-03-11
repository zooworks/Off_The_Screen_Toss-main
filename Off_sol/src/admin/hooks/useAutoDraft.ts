import { useState, useEffect, useCallback } from 'react';

interface AutoDraftData {
    data: unknown;
    savedAt: string;
}

export function useAutoDraft<T>(key: string, initialData: T) {
    const storageKey = `admin_draft_${key}`;
    const [isDirty, setIsDirty] = useState(false);
    const [lastSaved, setLastSaved] = useState<Date | null>(null);

    // 임시 저장 데이터 가져오기
    const getDraft = useCallback((): T | null => {
        try {
            const stored = localStorage.getItem(storageKey);
            if (stored) {
                const parsed: AutoDraftData = JSON.parse(stored);
                return parsed.data as T;
            }
        } catch (e) {
            console.error('Failed to load draft:', e);
        }
        return null;
    }, [storageKey]);

    // 임시 저장
    const saveDraft = useCallback((data: T) => {
        try {
            const draftData: AutoDraftData = {
                data,
                savedAt: new Date().toISOString(),
            };
            localStorage.setItem(storageKey, JSON.stringify(draftData));
            setLastSaved(new Date());
            setIsDirty(false);
        } catch (e) {
            console.error('Failed to save draft:', e);
        }
    }, [storageKey]);

    // 임시 저장 삭제
    const clearDraft = useCallback(() => {
        try {
            localStorage.removeItem(storageKey);
            setLastSaved(null);
            setIsDirty(false);
        } catch (e) {
            console.error('Failed to clear draft:', e);
        }
    }, [storageKey]);

    // 임시 저장본 존재 여부
    const hasDraft = useCallback((): boolean => {
        return localStorage.getItem(storageKey) !== null;
    }, [storageKey]);

    // 마지막 저장 시간 가져오기
    const getLastSavedTime = useCallback((): Date | null => {
        try {
            const stored = localStorage.getItem(storageKey);
            if (stored) {
                const parsed: AutoDraftData = JSON.parse(stored);
                return new Date(parsed.savedAt);
            }
        } catch (e) {
            console.error('Failed to get last saved time:', e);
        }
        return null;
    }, [storageKey]);

    // 페이지 이탈 시 경고
    useEffect(() => {
        const handleBeforeUnload = (e: BeforeUnloadEvent) => {
            if (isDirty) {
                e.preventDefault();
                e.returnValue = '저장하지 않은 변경사항이 있습니다. 페이지를 떠나시겠습니까?';
            }
        };
        window.addEventListener('beforeunload', handleBeforeUnload);
        return () => window.removeEventListener('beforeunload', handleBeforeUnload);
    }, [isDirty]);

    return {
        isDirty,
        setIsDirty,
        lastSaved,
        getDraft,
        saveDraft,
        clearDraft,
        hasDraft,
        getLastSavedTime,
    };
}
