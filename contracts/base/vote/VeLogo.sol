// SPDX-License-Identifier: MIT

pragma solidity 0.8.15;

import "./../../lib/Base64.sol";

/// @title Library for storing SVG image of veNFT.
library VeLogo {
    /// @dev Return SVG logo of veNFT.
    function tokenURI(
        uint _tokenId,
        uint _balanceOf,
        uint untilEnd,
        uint _value
    ) public pure returns (string memory output) {
        output = '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 600 900" style="enable-background:new 0 0 600 900;" xml:space="preserve"><style type="text/css">.st0{fill:#0092FF;}.st1{fill:#507B8E;}.st2{fill:#5CD2F7;}.st3{fill:#00B7E4;}.st4{fill:#0080DC;}.st5{fill:#00B4E1;}</style><rect class="st0" width="600" height="900"/><rect x="55" y="424" class="st1" width="544" height="98"/><rect y="544" class="st1" width="517" height="98"/><rect y="772" class="st1" width="516" height="98"/><rect x="55" y="658" class="st1" width="544" height="98"/><path class="st2" d="M62.2,419.7v97.8c0,0.5,0.4,0.9,0.9,0.9H600v-1.8H64v-96h536v-1.8H63.1C62.6,418.8,62.2,419.2,62.2,419.7z"/><path class="st2" d="M62.2,651.8v97.8c0,0.5,0.4,0.9,0.9,0.9H600v-1.8H64v-96h536v-1.8H63.1C62.6,650.9,62.2,651.3,62.2,651.8z"/><path class="st2" d="M512.3,636.3v-97.8c0-0.5-0.4-0.9-0.9-0.9H0v1.8h510.5v96H0v1.8h511.4C511.9,637.2,512.3,636.8,512.3,636.3z"/><path class="st2" d="M512.3,863.8V766c0-0.5-0.4-0.9-0.9-0.9H0v1.8h510.5v96H0v1.8h511.4C511.9,864.7,512.3,864.3,512.3,863.8z"/><path class="st1" d="M382.3,106.6"/><g><path class="st3" d="M394.2,121.6c1.1-1.2,1.1-3.1-0.1-4.3l-9-8.7c-1.2-1.1-3.1-1.1-4.2,0.1L195.7,299.5c-1.1,1.2-1.1,3.1,0,4.3l10.5,10.8c1.1,1.2,3,1.2,4.2,0L394.2,121.6z"/></g><path class="st3" d="M212.7,106.6"/><polygon class="st3" points="293.4,189.7 212.3,106.6 199.8,119.7 279.2,204.5 "/><polygon class="st4" points="404.7,303.4 391.1,318.9 306.9,228.2 319.4,216.3 "/><g><path class="st4" d="M404.2,135.8c-1.2-1.2-3-1.1-4.1,0.1l-7.9,9.1c-1.1,1.2-1,3.2,0.3,4.3l1.5,1.3c1.2,1.1,2.9,3.2,3.7,4.6l3,5.3c0.8,1.4,2.1,3.8,2.8,5.3l3.3,6.9c0.7,1.5,1.7,4,2.1,5.6l2.5,8.5c0.5,1.6,1.1,4.2,1.5,5.8l2.2,9.9c0.4,1.6,0.7,4.3,0.7,5.9v11.5c0,1.6-0.1,4.3-0.3,6l-1.2,11.2c-0.2,1.6-0.8,4.3-1.3,5.8l-3,8.3c-0.6,1.6-1.6,4.1-2.3,5.6l-3.4,7.6c-0.7,1.5-2.1,3.8-3.1,5.1l-4.1,5.3c-1,1.3-2,2.9-2.1,3.6c-0.2,0.7,0.6,2.2,1.8,3.4l8.6,9c1.1,1.2,2.8,1,3.7-0.4l8.1-13c0.9-1.4,2.1-3.8,2.7-5.3l5.4-13.1c0.6-1.5,1.7-4,2.3-5.5l0.9-2.2c0.6-1.5,1.4-4.1,1.7-5.7l1.6-8.9c0.3-1.6,0.7-4.3,0.9-5.9l1.1-9.7c0.2-1.6,0.2-4.3,0.1-6l-1-12.4c-0.1-1.6-0.5-4.3-0.7-6l-1.4-8.6c-0.3-1.6-0.9-4.2-1.4-5.8l-4-11.8c-0.5-1.6-1.5-4.1-2.2-5.6l-3.4-7.3c-0.7-1.5-2-3.9-2.9-5.3l-5.1-8c-0.9-1.4-2.6-3.5-3.7-4.7L404.2,135.8z"/></g><g><path class="st4" d="M279.7,348.3l-14-2.9c-1.6-0.3-4.2-1.2-5.7-1.8l-10.2-4.4c-1.5-0.7-3.9-1.9-5.3-2.8l-8.2-5.1c-1.4-0.9-3.6-2.4-5-3.3l-1.3-1c-1.3-1-1.5-2.7-0.3-3.8l8.4-8c1.2-1.1,3.4-1.5,4.9-0.9l4,1.7c1.5,0.7,3.9,1.9,5.3,2.7l9,5.3c1.4,0.8,3.9,1.9,5.5,2.4l6.7,2.1c1.6,0.5,4.2,1.1,5.8,1.3l10.1,1.4c1.6,0.2,4.3,0.4,6,0.4h8.5c1.6,0,4.3-0.3,5.9-0.7l6.6-1.5c1.6-0.4,4.2-1,5.8-1.4l7.2-1.8c1.6-0.4,4.1-1.4,5.5-2.2l6.9-3.9c1.4-0.8,3.8-2.1,5.3-2.8l5.6-2.9c1.5-0.8,3.6-0.4,4.8,0.8l8,8.2c1.2,1.2,1.1,3-0.2,4.1l-7.5,6.2c-1.3,1.1-3.5,2.5-5,3.3l-9.4,4.7c-1.5,0.7-4,1.6-5.6,2l-15.2,3.4c-1.6,0.4-4.3,0.8-5.9,1l-19.5,2.1"/></g><g><path class="st5" d="M204.4,146.3c1.1,1.2,1.2,3.2,0.2,4.5l-3.1,3.9c-1,1.3-2.5,3.5-3.3,5l-3.3,5.7c-0.8,1.4-2,3.9-2.6,5.4l-4.1,10.7c-0.6,1.5-1.4,4.1-1.8,5.7l-3,12c-0.4,1.6-0.7,4.3-0.7,5.9v10.3c0,1.6,0.1,4.3,0.2,6l0.8,14.2c0.1,1.6,0.6,4.3,1.1,5.8l5.2,15.9c0.5,1.6,1.6,4,2.4,5.4l2,3.5c0.8,1.4,2.2,3.7,3.1,5.1l1.6,2.5c0.9,1.4,1.9,2.9,2.3,3.4s-0.2,1.9-1.2,3.1l-9.4,10.6c-1.1,1.2-2.8,1.1-3.7-0.2l-6.9-9.9c-0.9-1.4-2.3-3.7-3.1-5.1l-4.3-8.3c-0.8-1.5-1.8-4-2.2-5.5l-4-13.8c-0.5-1.6-1-4.2-1.2-5.9l-1.9-13.6c-0.2-1.6-0.4-4.3-0.4-6v-6.1c0-1.7,0.1-4.3,0.2-6l0.8-11.8c0.1-1.6,0.5-4.3,0.9-5.9l3.3-13.4c0.4-1.6,1.2-4.2,1.8-5.7l4.1-10.7c0.6-1.5,1.8-3.9,2.7-5.3l6.3-10c0.9-1.4,2.5-3.6,3.5-4.9l4.8-5.8c1.1-1.3,2.8-1.3,4-0.1L204.4,146.3z"/></g><g><path class="st5" d="M242.2,114.8c1.1,1.2,3.2,1.5,4.6,0.7l5.5-3.2c1.4-0.8,3.9-2,5.4-2.5l6.5-2.3c1.6-0.6,4.1-1.3,5.7-1.7l8.7-2.2c1.6-0.4,4.2-0.9,5.9-1.1l8.3-0.9c1.6-0.2,4.3-0.3,6-0.3h6.4c1.6,0,4.3,0.3,5.9,0.6l10.1,2.1c1.6,0.3,4.2,1,5.8,1.6l7.9,2.7c1.6,0.5,4,1.7,5.3,2.6l6.6,4.5c1.4,0.9,3.5,0.8,4.6-0.4l10.5-10.1c1.2-1.1,1.1-2.9-0.2-3.9l-5.3-4.1c-1.3-1-3.6-2.3-5.2-2.9l-9.8-4c-1.5-0.6-4-1.6-5.5-2.3l-3.7-1.5c-1.5-0.6-4.1-1.4-5.7-1.7l-7.7-1.3c-1.6-0.3-4.3-0.7-5.9-0.9l-5.8-0.7c-1.6-0.2-4.3-0.4-6-0.4h-4.8c-1.6,0-4.3,0.1-6,0.3l-8.5,0.9c-1.6,0.2-4.3,0.6-5.9,0.9l-9.5,2c-1.6,0.3-4.2,1.1-5.8,1.6l-9.2,3.3c-1.6,0.6-4,1.6-5.5,2.4l-4.4,2.3c-1.5,0.8-3.8,2.2-5.1,3.2l-3.2,2.4c-1.3,1-1.5,2.8-0.4,4L242.2,114.8z"/></g></svg>';
        output = string(
            abi.encodePacked(
                output,
                '<text transform="matrix(1 0 0 1 88 463)" class="f s">ID:</text><text transform="matrix(1 0 0 1 88 502)" class="w s">',
                _toString(_tokenId),
                "</text>"
            )
        );
        output = string(
            abi.encodePacked(
                output,
                '<text transform="matrix(1 0 0 1 88 579)" class="f s">Balance:</text><text transform="matrix(1 0 0 1 88 618)" class="w s">',
                _toString(_balanceOf / 1e18),
                "</text>"
            )
        );
        output = string(
            abi.encodePacked(
                output,
                '<text transform="matrix(1 0 0 1 88 694)" class="f s">Until unlock:</text><text transform="matrix(1 0 0 1 88 733)" class="w s">',
                _toString(untilEnd / 60 / 60 / 24),
                " days</text>"
            )
        );
        output = string(
            abi.encodePacked(
                output,
                '<text transform="matrix(1 0 0 1 88 804)" class="f s">Power:</text><text transform="matrix(1 0 0 1 88 843)" class="w s">',
                _toString(_value / 1e18),
                "</text></svg>"
            )
        );

        string memory json = Base64.encode(
            bytes(
                string(
                    abi.encodePacked(
                        '{"name": "veXeno #',
                        _toString(_tokenId),
                        '", "description": "Locked XENO tokens", "image": "data:image/svg+xml;base64,',
                        Base64.encode(bytes(output)),
                        '"}'
                    )
                )
            )
        );
        output = string(
            abi.encodePacked("data:application/json;base64,", json)
        );
    }

    /// @dev Inspired by OraclizeAPI's implementation - MIT license
    ///      https://github.com/oraclize/ethereum-api/blob/b42146b063c7d6ee1358846c198246239e9360e8/oraclizeAPI_0.4.25.sol
    function _toString(uint value) internal pure returns (string memory) {
        if (value == 0) {
            return "0";
        }
        uint temp = value;
        uint digits;
        while (temp != 0) {
            digits++;
            temp /= 10;
        }
        bytes memory buffer = new bytes(digits);
        while (value != 0) {
            digits -= 1;
            buffer[digits] = bytes1(uint8(48 + uint(value % 10)));
            value /= 10;
        }
        return string(buffer);
    }
}
