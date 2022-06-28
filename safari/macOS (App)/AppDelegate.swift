//
//  AppDelegate.swift
//  macOS (App)
//
//  Created by Christopher Pickering on 6/23/22.
//

import Cocoa

@main
class AppDelegate: NSObject, NSApplicationDelegate {
    func applicationShouldTerminateAfterLastWindowClosed(_ sender: NSApplication) -> Bool {
        return true
    }
}
