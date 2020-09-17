/* Copyright (c) 2020 The Brave Authors. All rights reserved.
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this file,
 * You can obtain one at https://mozilla.org/MPL/2.0/. */

#include "chrome/browser/extensions/chrome_component_extension_resource_manager.h"

#include "brave/components/brave_extension/grit/brave_extension_generated_map.h"
#include "brave/components/brave_extension/grit/brave_extension_resources_map.h"
#include "brave/components/brave_rewards/browser/buildflags/buildflags.h"
#include "brave/components/brave_webtorrent/browser/buildflags/buildflags.h"

#include "brave/components/dissenter_extension/grit/dissenter_extension_generated_map.h"
#include "brave/components/dissenter_extension/grit/dissenter_extension_resources_map.h"

#if BUILDFLAG(ENABLE_BRAVE_WEBTORRENT)
#include "brave/components/brave_webtorrent/grit/brave_webtorrent_generated_map.h"
#include "brave/components/brave_webtorrent/grit/brave_webtorrent_resources_map.h"
#endif

#if BUILDFLAG(BRAVE_REWARDS_ENABLED)
#include "brave/components/brave_rewards/resources/extension/grit/brave_rewards_extension_resources_map.h"
#include "brave/components/brave_rewards/resources/extension/grit/brave_rewards_panel_generated_map.h"
#endif

#if BUILDFLAG(BRAVE_REWARDS_ENABLED)
#define BRAVE_REWARDS_EXTENSION_RESOURCES                           \
  AddComponentResourceEntries(kBraveRewardsExtensionResources,      \
                              kBraveRewardsExtensionResourcesSize); \
  AddComponentResourceEntries(kBraveRewardsPanelGenerated,          \
                              kBraveRewardsPanelGeneratedSize);
#else
#define BRAVE_REWARDS_EXTENSION_RESOURCES
#endif

#if BUILDFLAG(ENABLE_BRAVE_WEBTORRENT)
#define BRAVE_WEBTORRENT_RESOURCES                            \
  AddComponentResourceEntries(kBraveWebtorrentResources,      \
                              kBraveWebtorrentResourcesSize); \
  AddComponentResourceEntries(kBraveWebtorrentGenerated,      \
                              kBraveWebtorrentGeneratedSize);
#else
#define BRAVE_WEBTORRENT_RESOURCES
#endif

#define BRAVE_CHROME_COMPONENT_EXTENSION_RESOURCE_MANAGER_DATA_DATA  \
  AddComponentResourceEntries(kBraveExtension, kBraveExtensionSize); \
  AddComponentResourceEntries(kBraveExtensionGenerated,              \
                              kBraveExtensionGeneratedSize);         \
  BRAVE_REWARDS_EXTENSION_RESOURCES                                  \
  BRAVE_WEBTORRENT_RESOURCES                                         \
  AddComponentResourceEntries(kDissenterExtension,kDissenterExtensionSize); \
  AddComponentResourceEntries(kDissenterExtensionGenerated,kDissenterExtensionGeneratedSize);
#include "../../../../../chrome/browser/extensions/chrome_component_extension_resource_manager.cc"
#undef BRAVE_CHROME_COMPONENT_EXTENSION_RESOURCE_MANAGER_DATA_DATA
