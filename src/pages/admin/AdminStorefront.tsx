import React, { useState, useEffect } from 'react';
import { ArrowUp, ArrowDown, Plus, Trash2, Upload } from 'lucide-react';
import { Category, HomepageSectionKey, StorefrontConfig } from '../../types/commerce';
import { saveCategory, saveStorefrontConfig } from '../../lib/firestoreService';
import { uploadAdminImage } from '../../lib/imageUpload';

interface AdminStorefrontProps {
  config: StorefrontConfig;
  categories: Category[];
  actorEmail: string;
  onToast: (msg: string, tone?: 'default' | 'error' | 'success') => void;
}

const SECTION_LABELS: Record<HomepageSectionKey, string> = {
  hero: 'Hero Campaign',
  brand_intro: 'Brand Introduction',
  new_drop: 'New Drop (6 Products)',
  next_drop: 'Prochaine Collection (Next Drop)',
  categories: 'Explore Categories',
  featured: 'Featured Products',
  mireza_world: 'MIREZA World Gallery',
  newsletter: 'Newsletter',
};

export function AdminStorefront({
  config,
  categories,
  actorEmail,
  onToast,
}: AdminStorefrontProps) {
  const [draft, setDraft] = useState<StorefrontConfig>(config);
  const [saving, setSaving] = useState(false);
  const [uploadingField, setUploadingField] = useState<string | null>(null);

  useEffect(() => {
    setDraft(config);
  }, [config]);

  const handleUploadField = async (
    fieldKey: string,
    file: File | undefined,
    onUrl: (url: string) => void | Promise<void>
  ) => {
    if (!file) return;
    setUploadingField(fieldKey);
    try {
      const url = await uploadAdminImage(file);
      await onUrl(url);
      onToast('Photo uploaded successfully.', 'success');
    } catch (err: any) {
      onToast(err?.message || 'Unable to upload photo.', 'error');
    } finally {
      setUploadingField(null);
    }
  };

  const moveSection = (idx: number, dir: -1 | 1) => {
    const order = [...(draft.sectionOrder || [])];
    const target = idx + dir;
    if (target < 0 || target >= order.length) return;
    const temp = order[idx];
    order[idx] = order[target];
    order[target] = temp;
    setDraft({ ...draft, sectionOrder: order });
  };

  const handleSaveCms = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await saveStorefrontConfig(draft, actorEmail);
      onToast('Storefront CMS configuration published.', 'success');
    } catch {
      onToast('Failed to save storefront configuration.', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleUpdateCategoryImage = async (cat: Category, imageUrl: string) => {
    await saveCategory(
      cat.id,
      {
        name: cat.name,
        slug: cat.slug,
        description: cat.description,
        imageUrl,
        sortOrder: cat.sortOrder,
        isActive: cat.isActive,
      },
      actorEmail
    );
    onToast(`${cat.name} category updated.`, 'success');
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-editorial text-3xl text-black">Storefront CMS</h1>
        <p className="text-xs font-light text-black/60 mt-0.5">
          Control hero campaign imagery, editorial copy, section ordering, MIREZA World gallery, and category visuals. Upload photos directly from your device or paste image URLs.
        </p>
      </div>

      <form onSubmit={handleSaveCms} className="space-y-6">
        {/* Hero & Campaign Banner */}
        <div className="border border-black/15 bg-white p-6 space-y-4 text-xs">
          <h2 className="font-editorial text-2xl text-black">Hero &amp; Campaign Banner</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <label className="block space-y-1">
              <span className="font-bold uppercase tracking-wider text-black/60">Hero Headline</span>
              <input
                value={draft.heroHeadline}
                onChange={(e) => setDraft({ ...draft, heroHeadline: e.target.value })}
                className="w-full border border-black/25 px-3 py-2"
              />
            </label>
            <label className="block space-y-1">
              <span className="font-bold uppercase tracking-wider text-black/60">Hero CTA Label</span>
              <input
                value={draft.heroCtaLabel || ''}
                onChange={(e) => setDraft({ ...draft, heroCtaLabel: e.target.value })}
                className="w-full border border-black/25 px-3 py-2"
              />
            </label>
            <label className="block space-y-1 md:col-span-2">
              <span className="font-bold uppercase tracking-wider text-black/60">Hero Subheadline</span>
              <input
                value={draft.heroSubheadline}
                onChange={(e) => setDraft({ ...draft, heroSubheadline: e.target.value })}
                className="w-full border border-black/25 px-3 py-2 font-light"
              />
            </label>
            <div className="block space-y-1 md:col-span-2">
              <span className="font-bold uppercase tracking-wider text-black/60 block">
                Hero Photograph
              </span>
              <div className="flex flex-col sm:flex-row gap-2">
                <input
                  value={draft.heroImageUrl}
                  onChange={(e) => setDraft({ ...draft, heroImageUrl: e.target.value })}
                  className="flex-1 border border-black/25 px-3 py-2 font-light"
                />
                <label className="px-4 py-2 border border-black bg-black text-white font-bold uppercase tracking-wider inline-flex items-center justify-center gap-2 cursor-pointer shrink-0 hover:bg-black/85">
                  <Upload className="w-3.5 h-3.5" />
                  <span>{uploadingField === 'hero' ? 'Uploading...' : 'Upload Photo'}</span>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    disabled={uploadingField !== null}
                    onChange={(e) =>
                      handleUploadField('hero', e.target.files?.[0], (url) =>
                        setDraft((prev) => ({ ...prev, heroImageUrl: url }))
                      )
                    }
                  />
                </label>
              </div>
            </div>
            <div className="md:col-span-2 flex flex-col sm:flex-row sm:items-center gap-4 pt-2">
              <label className="flex items-center gap-2 font-bold cursor-pointer">
                <input
                  type="checkbox"
                  checked={Boolean(draft.campaignBannerEnabled)}
                  onChange={(e) =>
                    setDraft({ ...draft, campaignBannerEnabled: e.target.checked })
                  }
                  className="accent-black"
                />
                <span>Show Campaign Top Banner</span>
              </label>
              <input
                value={draft.campaignBannerText || ''}
                onChange={(e) => setDraft({ ...draft, campaignBannerText: e.target.value })}
                placeholder="Campaign banner announcement text"
                className="flex-1 border border-black/25 px-3 py-2"
              />
            </div>
          </div>
        </div>

        {/* Brand Intro & Newsletter Copy */}
        <div className="border border-black/15 bg-white p-6 space-y-4 text-xs">
          <h2 className="font-editorial text-2xl text-black">
            Brand Introduction &amp; Newsletter
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <label className="block space-y-1">
              <span className="font-bold uppercase tracking-wider text-black/60">Intro Title</span>
              <input
                value={draft.brandIntroTitle}
                onChange={(e) => setDraft({ ...draft, brandIntroTitle: e.target.value })}
                className="w-full border border-black/25 px-3 py-2"
              />
            </label>
            <div className="block space-y-1">
              <span className="font-bold uppercase tracking-wider text-black/60 block">
                Intro Image
              </span>
              <div className="flex gap-2">
                <input
                  value={draft.brandIntroImageUrl}
                  onChange={(e) => setDraft({ ...draft, brandIntroImageUrl: e.target.value })}
                  className="flex-1 min-w-0 border border-black/25 px-3 py-2 font-light"
                />
                <label className="px-3 py-2 border border-black bg-black text-white font-bold uppercase tracking-wider inline-flex items-center gap-1.5 cursor-pointer shrink-0 hover:bg-black/85">
                  <Upload className="w-3.5 h-3.5" />
                  <span>{uploadingField === 'brandIntro' ? '...' : 'Upload'}</span>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    disabled={uploadingField !== null}
                    onChange={(e) =>
                      handleUploadField('brandIntro', e.target.files?.[0], (url) =>
                        setDraft((prev) => ({ ...prev, brandIntroImageUrl: url }))
                      )
                    }
                  />
                </label>
              </div>
            </div>
            <label className="block space-y-1 md:col-span-2">
              <span className="font-bold uppercase tracking-wider text-black/60">Brand Statement</span>
              <textarea
                rows={3}
                value={draft.brandIntroBody}
                onChange={(e) => setDraft({ ...draft, brandIntroBody: e.target.value })}
                className="w-full border border-black/25 px-3 py-2 font-light"
              />
            </label>
            <label className="block space-y-1">
              <span className="font-bold uppercase tracking-wider text-black/60">Newsletter Heading</span>
              <input
                value={draft.newsletterTitle}
                onChange={(e) => setDraft({ ...draft, newsletterTitle: e.target.value })}
                className="w-full border border-black/25 px-3 py-2"
              />
            </label>
            <label className="block space-y-1">
              <span className="font-bold uppercase tracking-wider text-black/60">Newsletter Subtext</span>
              <input
                value={draft.newsletterBody}
                onChange={(e) => setDraft({ ...draft, newsletterBody: e.target.value })}
                className="w-full border border-black/25 px-3 py-2 font-light"
              />
            </label>
          </div>
        </div>

        {/* Homepage Section Ordering */}
        <div className="bg-white p-6 space-y-4 text-xs">
          <h2 className="font-editorial text-2xl text-black">Homepage Section Order</h2>
          <div className="space-y-1">
            {(draft.sectionOrder || []).map((sec, idx) => (
              <div key={sec} className={`px-4 py-2.5 flex items-center justify-between ${idx % 2 === 1 ? 'bg-black/[0.02]' : 'bg-[#F7F7F7]/60'}`}>
                <span className="font-bold">
                  {idx + 1}. {SECTION_LABELS[sec] || sec}
                </span>
                <div className="flex gap-1">
                  <button
                    type="button"
                    onClick={() => moveSection(idx, -1)}
                    className="p-1.5 border border-black/20 hover:border-black cursor-pointer"
                  >
                    <ArrowUp className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => moveSection(idx, 1)}
                    className="p-1.5 border border-black/20 hover:border-black cursor-pointer"
                  >
                    <ArrowDown className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* MIREZA World Gallery */}
        <div className="border border-black/15 bg-white p-6 space-y-4 text-xs">
          <div className="flex items-center justify-between">
            <h2 className="font-editorial text-2xl text-black">MIREZA World Gallery</h2>
            <button
              type="button"
              onClick={() =>
                setDraft({
                  ...draft,
                  galleryItems: [
                    ...(draft.galleryItems || []),
                    {
                      id: `world_${Date.now()}`,
                      title: 'New Editorial Feature',
                      caption: 'Campaign photography',
                      imageUrl: draft.heroImageUrl,
                      tag: 'Editorial',
                    },
                  ],
                })
              }
              className="px-3 py-1.5 border border-black font-bold inline-flex items-center gap-1 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Entry</span>
            </button>
          </div>
          <div className="space-y-3">
            {(draft.galleryItems || []).map((item, idx) => (
              <div
                key={item.id}
                className="grid grid-cols-1 md:grid-cols-12 gap-2 items-center bg-[#F7F7F7]/60 p-3"
              >
                <input
                  value={item.title}
                  onChange={(e) => {
                    const next = [...draft.galleryItems];
                    next[idx] = { ...item, title: e.target.value };
                    setDraft({ ...draft, galleryItems: next });
                  }}
                  placeholder="Title"
                  className="md:col-span-3 border border-black/25 px-2.5 py-2"
                />
                <input
                  value={item.tag}
                  onChange={(e) => {
                    const next = [...draft.galleryItems];
                    next[idx] = { ...item, tag: e.target.value };
                    setDraft({ ...draft, galleryItems: next });
                  }}
                  placeholder="Tag"
                  className="md:col-span-2 border border-black/25 px-2.5 py-2"
                />
                <input
                  value={item.caption}
                  onChange={(e) => {
                    const next = [...draft.galleryItems];
                    next[idx] = { ...item, caption: e.target.value };
                    setDraft({ ...draft, galleryItems: next });
                  }}
                  placeholder="Caption"
                  className="md:col-span-3 border border-black/25 px-2.5 py-2 font-light"
                />
                <div className="md:col-span-3 flex gap-1.5">
                  <input
                    value={item.imageUrl}
                    onChange={(e) => {
                      const next = [...draft.galleryItems];
                      next[idx] = { ...item, imageUrl: e.target.value };
                      setDraft({ ...draft, galleryItems: next });
                    }}
                    placeholder="Image URL"
                    className="flex-1 min-w-0 border border-black/25 px-2.5 py-2 font-light"
                  />
                  <label className="px-2.5 py-2 border border-black bg-black text-white font-bold inline-flex items-center cursor-pointer shrink-0 hover:bg-black/85">
                    <Upload className="w-3.5 h-3.5" />
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      disabled={uploadingField !== null}
                      onChange={(e) =>
                        handleUploadField(`gallery_${idx}`, e.target.files?.[0], (url) => {
                          setDraft((prev) => {
                            const next = [...prev.galleryItems];
                            next[idx] = { ...next[idx], imageUrl: url };
                            return { ...prev, galleryItems: next };
                          });
                        })
                      }
                    />
                  </label>
                </div>
                <button
                  type="button"
                  onClick={() =>
                    setDraft({
                      ...draft,
                      galleryItems: draft.galleryItems.filter((_, i) => i !== idx),
                    })
                  }
                  className="md:col-span-1 text-black/60 hover:text-black justify-self-end cursor-pointer"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="px-8 py-3 bg-black text-white text-xs font-bold uppercase tracking-[0.18em] cursor-pointer disabled:opacity-50"
          >
            {saving ? 'Publishing CMS...' : 'Save & Publish Storefront'}
          </button>
        </div>
      </form>

      {/* Category Images Quick Editor */}
      <div className="bg-white p-6 space-y-4 text-xs">
        <h2 className="font-editorial text-2xl text-black">Category Editorial Imagery</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {categories.map((cat) => (
            <div key={cat.id} className="bg-[#F7F7F7] p-4 flex gap-4 items-center">
              <div className="w-16 bg-white shrink-0 overflow-hidden">
                <img
                  src={cat.imageUrl}
                  alt={cat.name}
                  referrerPolicy="no-referrer"
                  className="w-full h-auto block"
                />
              </div>
              <div className="flex-1 space-y-1.5 min-w-0">
                <p className="font-bold text-sm">{cat.name}</p>
                <div className="flex gap-2">
                  <input
                    defaultValue={cat.imageUrl}
                    key={`${cat.id}_${cat.imageUrl}`}
                    onBlur={(e) => {
                      if (e.target.value !== cat.imageUrl) {
                        handleUpdateCategoryImage(cat, e.target.value);
                      }
                    }}
                    className="flex-1 min-w-0 rounded-none bg-white px-2.5 py-1.5 font-light text-[11px] focus:outline-none"
                  />
                  <label className="px-2.5 py-1.5 rounded-none bg-black text-white font-bold inline-flex items-center gap-1 cursor-pointer shrink-0 hover:bg-black/85">
                    <Upload className="w-3 h-3" />
                    <span>{uploadingField === `cat_${cat.id}` ? '...' : 'Upload'}</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      disabled={uploadingField !== null}
                      onChange={(e) =>
                        handleUploadField(`cat_${cat.id}`, e.target.files?.[0], (url) =>
                          handleUpdateCategoryImage(cat, url)
                        )
                      }
                    />
                  </label>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
