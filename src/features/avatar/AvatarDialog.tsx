
import { useState } from "react";
import { vrmLoader } from "./vrmUtils";
import { VRM, type VRMMeta } from "@pixiv/three-vrm";
import * as THREE from "three";

interface VRMMetadata {
  title?: string;
  version?: string;
  author?: string;
  contactInformation?: string;
  reference?: string;
  texture?: string;
  allowedUserName?: string;
  violentUssageName?: string;
  sexualUssageName?: string;
  commercialUssageName?: string;
  otherPermissionUrl?: string;
  licenseName?: string;
  otherLicenseUrl?: string;
  thumbnailUrl?: string;
}

interface AvatarDialogProps {
  onClose: () => void;
}

export const AvatarDialog = ({ onClose }: AvatarDialogProps) => {
  const [vrmFile, setVrmFile] = useState<File | null>(null);
  const [vrmaFile, setVrmaFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [vrmMetadata, setVrmMetadata] = useState<VRMMetadata | null>(null);
  const [isLoadingMetadata, setIsLoadingMetadata] = useState(false);

  const loadVrmMetadata = async (file: File) => {
    setIsLoadingMetadata(true);
    try {
      const url = URL.createObjectURL(file);
      vrmLoader.load(url, (gltf) => {
        const vrm: VRM = gltf.userData.vrm;
        const meta: VRMMeta = vrm.meta;
        
        // サムネイル画像のURL生成関数
        const getThumbnailUrl = (thumbnail: HTMLImageElement | THREE.Texture | undefined) => {
          if (!thumbnail) return undefined;
          
          if (thumbnail instanceof HTMLImageElement) {
            return thumbnail.src;
          } else if ('image' in thumbnail && thumbnail.image instanceof HTMLImageElement) {
            return thumbnail.image.src;
          }
          return undefined;
        };

        if (meta.metaVersion === '1') {
          // VRM 1.0 format
          setVrmMetadata({
            title: meta.name,
            version: meta.version,
            author: meta.authors?.[0],
            contactInformation: meta.contactInformation,
            reference: meta.references?.[0],
            allowedUserName: meta.avatarPermission,
            violentUssageName: meta.allowExcessivelyViolentUsage ? 'Allow' : 'Disallow',
            sexualUssageName: meta.allowExcessivelySexualUsage ? 'Allow' : 'Disallow',
            commercialUssageName: meta.commercialUsage,
            licenseName: meta.licenseUrl,
            otherLicenseUrl: meta.otherLicenseUrl,
            thumbnailUrl: getThumbnailUrl(meta.thumbnailImage),
          });
        } else {
          // VRM 0.x format
          setVrmMetadata({
            title: meta.title,
            version: meta.version,
            author: meta.author,
            contactInformation: meta.contactInformation,
            reference: meta.reference,
            allowedUserName: meta.allowedUserName,
            violentUssageName: meta.violentUssageName,
            sexualUssageName: meta.sexualUssageName,
            commercialUssageName: meta.commercialUssageName,
            licenseName: meta.licenseName,
            otherLicenseUrl: meta.otherLicenseUrl,
            thumbnailUrl: getThumbnailUrl(meta.texture),
          });
        }
        
        URL.revokeObjectURL(url);
        setIsLoadingMetadata(false);
      });
    } catch (error) {
      console.error('Failed to load VRM metadata:', error);
      setIsLoadingMetadata(false);
    }
  };

  const handleVrmFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.name.endsWith('.vrm')) {
      setVrmFile(file);
      loadVrmMetadata(file);
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
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[10000000]">
      <div className="bg-white rounded-lg p-6 w-[32rem] max-w-full mx-4 max-h-[80vh] overflow-y-auto">
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
          
          {/* VRMメタ情報表示 */}
          {vrmFile && (
            <div className="border-t pt-4">
              <h3 className="text-sm font-medium text-gray-800 mb-2">VRMメタ情報</h3>
              {isLoadingMetadata ? (
                <p className="text-sm text-gray-500">メタ情報を読み込み中...</p>
              ) : vrmMetadata ? (
                <div className="space-y-3">
                  {/* サムネイル画像 */}
                  {vrmMetadata.thumbnailUrl && (
                    <div className="flex justify-center">
                      <img 
                        src={vrmMetadata.thumbnailUrl} 
                        alt="VRMサムネイル" 
                        className="w-24 h-24 object-cover rounded-lg border-2 border-gray-200"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                        }}
                      />
                    </div>
                  )}
                  
                  <div className="space-y-2 text-xs">
                    {vrmMetadata.title && (
                      <div>
                        <span className="font-medium text-gray-600">タイトル:</span>
                        <span className="ml-2 text-gray-800">{vrmMetadata.title}</span>
                      </div>
                    )}
                    {vrmMetadata.author && (
                      <div>
                        <span className="font-medium text-gray-600">作者:</span>
                        <span className="ml-2 text-gray-800">{vrmMetadata.author}</span>
                      </div>
                    )}
                    {vrmMetadata.version && (
                      <div>
                        <span className="font-medium text-gray-600">バージョン:</span>
                        <span className="ml-2 text-gray-800">{vrmMetadata.version}</span>
                      </div>
                    )}
                    {vrmMetadata.contactInformation && (
                      <div>
                        <span className="font-medium text-gray-600">連絡先:</span>
                        <span className="ml-2 text-gray-800">{vrmMetadata.contactInformation}</span>
                      </div>
                    )}
                    {vrmMetadata.reference && (
                      <div>
                        <span className="font-medium text-gray-600">参照:</span>
                        <span className="ml-2 text-gray-800">{vrmMetadata.reference}</span>
                      </div>
                    )}
                    {vrmMetadata.allowedUserName && (
                      <div>
                        <span className="font-medium text-gray-600">利用許可:</span>
                        <span className="ml-2 text-gray-800">{vrmMetadata.allowedUserName}</span>
                      </div>
                    )}
                    {vrmMetadata.violentUssageName && (
                      <div>
                        <span className="font-medium text-gray-600">暴力表現:</span>
                        <span className="ml-2 text-gray-800">{vrmMetadata.violentUssageName}</span>
                      </div>
                    )}
                    {vrmMetadata.sexualUssageName && (
                      <div>
                        <span className="font-medium text-gray-600">性的表現:</span>
                        <span className="ml-2 text-gray-800">{vrmMetadata.sexualUssageName}</span>
                      </div>
                    )}
                    {vrmMetadata.commercialUssageName && (
                      <div>
                        <span className="font-medium text-gray-600">商用利用:</span>
                        <span className="ml-2 text-gray-800">{vrmMetadata.commercialUssageName}</span>
                      </div>
                    )}
                    {vrmMetadata.licenseName && (
                      <div>
                        <span className="font-medium text-gray-600">ライセンス:</span>
                        <span className="ml-2 text-gray-800">{vrmMetadata.licenseName}</span>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <p className="text-sm text-red-500">メタ情報の読み込みに失敗しました</p>
              )}
            </div>
          )}
          
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