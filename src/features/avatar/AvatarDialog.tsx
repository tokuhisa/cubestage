
import { useState } from "react";

interface AvatarDialogProps {
  onClose: () => void;
}

export const AvatarDialog = ({ onClose }: AvatarDialogProps) => {
  const [vrmFile, setVrmFile] = useState<File | null>(null);
  const [vrmaFile, setVrmaFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleVrmFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.name.endsWith('.vrm')) {
      setVrmFile(file);
    }
  };

  const handleVrmaFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.name.endsWith('.vrma')) {
      setVrmaFile(file);
    }
  };

  const saveToOPFS = async () => {
    if (!vrmFile || !vrmaFile) return;
    
    setIsLoading(true);
    try {
      const opfsRoot = await navigator.storage.getDirectory();
      
      // VRMファイルを保存
      const vrmFileHandle = await opfsRoot.getFileHandle('avatar.vrm', { create: true });
      const vrmWritable = await vrmFileHandle.createWritable();
      await vrmWritable.write(vrmFile);
      await vrmWritable.close();
      
      // VRMAファイルを保存
      const vrmaFileHandle = await opfsRoot.getFileHandle('avatar.vrma', { create: true });
      const vrmaWritable = await vrmaFileHandle.createWritable();
      await vrmaWritable.write(vrmaFile);
      await vrmaWritable.close();
      
      // カスタムイベントを発行してアバターの再読み込みを通知
      window.dispatchEvent(new Event('avatar-files-updated'));
      
      onClose();
    } catch (error) {
      console.error('Failed to save files to OPFS:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-96 max-w-full mx-4">
        <h2 className="text-xl font-semibold mb-4">アバター設定</h2>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              VRMファイル (.vrm)
            </label>
            <input
              type="file"
              accept=".vrm"
              onChange={handleVrmFileChange}
              className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            />
            {vrmFile && (
              <p className="text-sm text-green-600 mt-1">
                選択済み: {vrmFile.name}
              </p>
            )}
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              VRMAファイル (.vrma)
            </label>
            <input
              type="file"
              accept=".vrma"
              onChange={handleVrmaFileChange}
              className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            />
            {vrmaFile && (
              <p className="text-sm text-green-600 mt-1">
                選択済み: {vrmaFile.name}
              </p>
            )}
          </div>
        </div>
        
        <div className="flex justify-end gap-3 mt-6">
          <button
            onClick={onClose}
            disabled={isLoading}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
          >
            キャンセル
          </button>
          <button
            onClick={saveToOPFS}
            disabled={!vrmFile || !vrmaFile || isLoading}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-500 rounded hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? '保存中...' : '保存'}
          </button>
        </div>
      </div>
    </div>
  );
};