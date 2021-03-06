/* Copyright (c) 2020 The Brave Authors. All rights reserved.
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this file,
 * You can obtain one at https://mozilla.org/MPL/2.0/. */

#include "brave/components/brave_private_cdn/private_cdn_helper.h"

#include "base/big_endian.h"

namespace brave {

bool PrivateCdnHelper::RemovePadding(std::string* padded_string) const {
  if (!padded_string) {
    return false;
  }

  if (padded_string->size() < sizeof(uint32_t)) {
    return false;  // Missing length field
  }

  // Read payload length from the header.
  uint32_t data_length;
  base::ReadBigEndian(padded_string->c_str(), &data_length);

  // Remove length header.
  padded_string->erase(0, sizeof(uint32_t));
  if (padded_string->size() < data_length) {
    return false;  // Payload shorter than expected length
  }

  // Remove padding.
  padded_string->resize(data_length);
  return true;
}

PrivateCdnHelper::PrivateCdnHelper() = default;

PrivateCdnHelper::~PrivateCdnHelper() = default;

}  // namespace brave
