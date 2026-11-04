/**
 * Complete licence-client templates for platforms not covered by
 * fc_generate_client_sdk.
 *
 * Every template implements the full contract against a FluentCart store
 * running Fastr Devices: activate, check, deactivate, RS256 verification of
 * the offline licence token, release checking and usage reporting.
 *
 * The rule that matters in every language: a licence is valid only when
 * status == "valid". FluentCart returns key_mismatch and invalid_activation
 * as HTTP 200 with success=true.
 */

export type NativePlatform = 'swift' | 'unity_csharp' | 'java' | 'php' | 'c';

function banner(appName: string, title: string, file: string, base: string, productId: number): string {
  return [
    `// ${appName} - FluentCart licence client (${title})`,
    `// File: ${file}`,
    `// Store: ${base}   Product: ${productId}`,
    '// Contract: activate, check, deactivate, RS256 token, releases, usage.',
    '// Valid only when status == "valid" - FluentCart returns key_mismatch and',
    '// invalid_activation as HTTP 200 with success=true.'
  ].join('\n');
}

export function nativeClientTemplate(
  platform: NativePlatform,
  base: string,
  productId: number,
  appName: string
): string {
  if (platform === 'swift') {
    return `${banner(appName, 'Swift / iOS + macOS', 'LicenseClient.swift', base, productId)}
import Foundation
import Security

struct LicenseState: Decodable {
    let status: String
    let entitlements: [Int]?
    let licenseToken: String?
    let errorType: String?

    enum CodingKeys: String, CodingKey {
        case status, entitlements
        case licenseToken = "license_token"
        case errorType = "error_type"
    }

    var isValid: Bool { return status == "valid" }
}

enum FastrLicense {
    static let store = "${base}"
    static let productId = ${productId}

    private static func post(_ verb: String, _ fields: [String: String]) -> [String: Any] {
        var request = URLRequest(url: URL(string: store + "?fluent-cart=" + verb)!)
        request.httpMethod = "POST"
        request.setValue("application/x-www-form-urlencoded", forHTTPHeaderField: "Content-Type")

        var components = URLComponents()
        components.queryItems = fields.map { URLQueryItem(name: $0.key, value: $0.value) }
        request.httpBody = components.percentEncodedQuery?.data(using: .utf8)

        let semaphore = DispatchSemaphore(value: 0)
        var body: [String: Any] = [:]

        URLSession.shared.dataTask(with: request) { data, _, _ in
            if let data = data,
               let json = try? JSONSerialization.jsonObject(with: data) as? [String: Any] {
                body = json
            }
            semaphore.signal()
        }.resume()

        _ = semaphore.wait(timeout: .now() + 15)
        return body
    }

    private static func get(_ query: String) -> [String: Any] {
        guard let url = URL(string: store + "?fluent-cart=" + query) else { return [:] }

        let semaphore = DispatchSemaphore(value: 0)
        var body: [String: Any] = [:]

        URLSession.shared.dataTask(with: url) { data, _, _ in
            if let data = data,
               let json = try? JSONSerialization.jsonObject(with: data) as? [String: Any] {
                body = json
            }
            semaphore.signal()
        }.resume()

        _ = semaphore.wait(timeout: .now() + 15)
        return body
    }

    static func activate(key: String, instanceId: String, fingerprint: String, email: String) -> LicenseState? {
        let json = post("activate_license", [
            "item_id": String(productId),
            "license_key": key.trimmingCharacters(in: .whitespacesAndNewlines),
            "site_url": instanceId,
            "device_fingerprint": fingerprint,
            "device_name": ProcessInfo.processInfo.hostName,
            "device_type": "Desktop (Swift)",
            "os": ProcessInfo.processInfo.operatingSystemVersionString,
            "email": email,
            "server_version": Bundle.main.infoDictionary?["CFBundleShortVersionString"] as? String ?? "1.0.0"
        ])

        guard let data = try? JSONSerialization.data(withJSONObject: json) else { return nil }
        return try? JSONDecoder().decode(LicenseState.self, from: data)
    }

    static func check(key: String, instanceId: String, fingerprint: String) -> LicenseState? {
        let json = post("check_license", [
            "item_id": String(productId),
            "license_key": key,
            "site_url": instanceId,
            "device_fingerprint": fingerprint
        ])

        guard let data = try? JSONSerialization.data(withJSONObject: json) else { return nil }
        return try? JSONDecoder().decode(LicenseState.self, from: data)
    }

    static func deactivate(key: String, instanceId: String) {
        _ = post("deactivate_license", [
            "item_id": String(productId),
            "license_key": key,
            "site_url": instanceId
        ])
    }

    /// SecKey expects PKCS#1 for RSA. A PEM SubjectPublicKeyInfo carries a
    /// 24-byte header first, so strip it when present.
    static func verifyToken(_ token: String, publicKeyPem: String) -> [String: Any]? {
        let parts = token.split(separator: ".")
        guard parts.count == 3 else { return nil }

        let pem = publicKeyPem
            .replacingOccurrences(of: "-----BEGIN PUBLIC KEY-----", with: "")
            .replacingOccurrences(of: "-----END PUBLIC KEY-----", with: "")
            .components(separatedBy: .whitespacesAndNewlines).joined()

        guard var der = Data(base64Encoded: pem) else { return nil }
        if der.count > 24 { der = der.subdata(in: 24..<der.count) }

        let attributes: [String: Any] = [
            kSecAttrKeyType as String: kSecAttrKeyTypeRSA,
            kSecAttrKeyClass as String: kSecAttrKeyClassPublic
        ]

        guard let key = SecKeyCreateWithData(der as CFData, attributes as CFDictionary, nil),
              let signature = base64UrlDecode(String(parts[2])) else { return nil }

        let signed = Data((String(parts[0]) + "." + String(parts[1])).utf8)

        guard SecKeyVerifySignature(key, .rsaSignatureMessagePKCS1v15SHA256, signed as CFData, signature as CFData, nil),
              let payload = base64UrlDecode(String(parts[1])),
              let claims = try? JSONSerialization.jsonObject(with: payload) as? [String: Any] else { return nil }

        return claims
    }

    private static func base64UrlDecode(_ value: String) -> Data? {
        var base64 = value.replacingOccurrences(of: "-", with: "+").replacingOccurrences(of: "_", with: "/")
        base64 += String(repeating: "=", count: (4 - base64.count % 4) % 4)
        return Data(base64Encoded: base64)
    }

    static func latestRelease(key: String, current: String, platform: String = "any") -> [String: Any] {
        var components = URLComponents()
        components.queryItems = [
            URLQueryItem(name: "product_id", value: String(productId)),
            URLQueryItem(name: "platform", value: platform),
            URLQueryItem(name: "current_version", value: current),
            URLQueryItem(name: "license_key", value: key)
        ]

        return get("fastr_release_latest&" + (components.percentEncodedQuery ?? ""))
    }

    static func reportUsage(key: String, metric: String, quantity: Int, idempotencyKey: String) -> [String: Any] {
        post("fastr_usage_report", [
            "license_key": key,
            "metric": metric,
            "quantity": String(quantity),
            "idempotency_key": idempotencyKey
        ])
    }
}
`;
  }

  if (platform === 'unity_csharp') {
    return `${banner(appName, 'Unity / C#', 'FastrLicense.cs', base, productId)}
using System;
using System.Collections.Generic;
using System.Security.Cryptography;
using System.Text;
using System.Text.Json;
using UnityEngine;
using UnityEngine.Networking;

public static class FastrLicense
{
    private const string Store = "${base}";
    private const int ProductId = ${productId};

    public sealed class State
    {
        public string Status = "";
        public string Token;
        public string ErrorType;
        public List<int> Entitlements = new List<int>();
        public bool IsValid { get { return Status == "valid"; } }
    }

    private static string Call(string verb, Dictionary<string, string> body)
    {
        var form = new List<string>();
        foreach (var pair in body) form.Add(Uri.EscapeDataString(pair.Key) + "=" + Uri.EscapeDataString(pair.Value));

        using (var request = new UnityWebRequest(Store + "?fluent-cart=" + verb, "POST"))
        {
            request.uploadHandler = new UploadHandlerRaw(Encoding.UTF8.GetBytes(string.Join("&", form)));
            request.downloadHandler = new DownloadHandlerBuffer();
            request.SetRequestHeader("Content-Type", "application/x-www-form-urlencoded");
            request.timeout = 15;

            var operation = request.SendWebRequest();
            while (!operation.isDone) { }

            return request.downloadHandler.text;
        }
    }

    private static string Get(string url)
    {
        using (var request = UnityWebRequest.Get(url))
        {
            request.timeout = 15;
            var operation = request.SendWebRequest();
            while (!operation.isDone) { }
            return request.downloadHandler.text;
        }
    }

    private static State Parse(string json)
    {
        var state = new State();
        if (string.IsNullOrEmpty(json)) return state;

        using (var document = JsonDocument.Parse(json))
        {
            var root = document.RootElement;
            if (root.TryGetProperty("status", out var status)) state.Status = status.GetString() ?? "";
            if (root.TryGetProperty("license_token", out var token)) state.Token = token.GetString();
            if (root.TryGetProperty("error_type", out var error)) state.ErrorType = error.GetString();
            if (root.TryGetProperty("entitlements", out var ents) && ents.ValueKind == JsonValueKind.Array)
                foreach (var id in ents.EnumerateArray()) state.Entitlements.Add(id.GetInt32());
        }

        return state;
    }

    public static State Activate(string key, string instanceId, string fingerprint, string email)
    {
        return Parse(Call("activate_license", new Dictionary<string, string>
        {
            { "item_id", ProductId.ToString() },
            { "license_key", key.Trim() },
            { "site_url", instanceId },
            { "device_fingerprint", fingerprint },
            { "device_name", SystemInfo.deviceName },
            { "device_type", "Game (Unity)" },
            { "os", SystemInfo.operatingSystem },
            { "email", email },
            { "server_version", Application.version }
        }));
    }

    public static State Check(string key, string instanceId, string fingerprint)
    {
        return Parse(Call("check_license", new Dictionary<string, string>
        {
            { "item_id", ProductId.ToString() },
            { "license_key", key },
            { "site_url", instanceId },
            { "device_fingerprint", fingerprint }
        }));
    }

    public static void Deactivate(string key, string instanceId)
    {
        Call("deactivate_license", new Dictionary<string, string>
        {
            { "item_id", ProductId.ToString() },
            { "license_key", key },
            { "site_url", instanceId }
        });
    }

    /// <summary>Needs .NET Standard 2.1 (Unity 2021.2+) for ImportSubjectPublicKeyInfo.</summary>
    public static bool VerifyToken(string token, string publicKeyPem, out Dictionary<string, object> claims)
    {
        claims = null;

        var parts = token.Split('.');
        if (parts.Length != 3) return false;

        var der = Convert.FromBase64String(publicKeyPem
            .Replace("-----BEGIN PUBLIC KEY-----", "")
            .Replace("-----END PUBLIC KEY-----", "")
            .Replace("\\n", "").Replace("\\r", "").Trim());

        using (var rsa = RSA.Create())
        {
            rsa.ImportSubjectPublicKeyInfo(der, out _);

            var signed = Encoding.UTF8.GetBytes(parts[0] + "." + parts[1]);

            if (!rsa.VerifyData(signed, Base64UrlDecode(parts[2]), HashAlgorithmName.SHA256, RSASignaturePadding.Pkcs1))
                return false;
        }

        claims = JsonSerializer.Deserialize<Dictionary<string, object>>(
            Encoding.UTF8.GetString(Base64UrlDecode(parts[1])));

        return claims != null;
    }

    private static byte[] Base64UrlDecode(string value)
    {
        var padded = value.Replace('-', '+').Replace('_', '/');
        padded += new string('=', (4 - padded.Length % 4) % 4);
        return Convert.FromBase64String(padded);
    }

    public static string LatestRelease(string key, string currentVersion)
    {
        var url = Store + "?fluent-cart=fastr_release_latest"
                + "&product_id=" + ProductId
                + "&platform=any"
                + "&current_version=" + UnityWebRequest.EscapeURL(currentVersion)
                + "&license_key=" + UnityWebRequest.EscapeURL(key);

        return Get(url);
    }

    public static string ReportUsage(string key, string metric, int quantity, string idempotencyKey)
    {
        return Call("fastr_usage_report", new Dictionary<string, string>
        {
            { "license_key", key },
            { "metric", metric },
            { "quantity", quantity.ToString() },
            { "idempotency_key", idempotencyKey }
        });
    }
}
`;
  }

  if (platform === 'java') {
    return `${banner(appName, 'Java / JVM', 'FastrLicense.java', base, productId)}
import java.io.ByteArrayOutputStream;
import java.io.InputStream;
import java.io.OutputStream;
import java.net.HttpURLConnection;
import java.net.URL;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.security.KeyFactory;
import java.security.PublicKey;
import java.security.Signature;
import java.security.spec.X509EncodedKeySpec;
import java.util.Base64;
import java.util.LinkedHashMap;
import java.util.Map;

public final class FastrLicense {

    public static final String STORE = "${base}";
    public static final int PRODUCT_ID = ${productId};

    public static final class State {
        public String status = "";
        public String token;
        public String errorType;
        public boolean isValid() { return "valid".equals(status); }
    }

    private static String post(String verb, Map<String, String> fields) throws Exception {
        StringBuilder form = new StringBuilder();
        for (Map.Entry<String, String> entry : fields.entrySet()) {
            if (form.length() > 0) form.append('&');
            form.append(URLEncoder.encode(entry.getKey(), "UTF-8"))
                .append('=')
                .append(URLEncoder.encode(entry.getValue(), "UTF-8"));
        }

        HttpURLConnection connection = (HttpURLConnection) new URL(STORE + "?fluent-cart=" + verb).openConnection();
        connection.setRequestMethod("POST");
        connection.setDoOutput(true);
        connection.setConnectTimeout(15000);
        connection.setReadTimeout(15000);
        connection.setRequestProperty("Content-Type", "application/x-www-form-urlencoded");

        try (OutputStream out = connection.getOutputStream()) {
            out.write(form.toString().getBytes(StandardCharsets.UTF_8));
        }

        return read(connection);
    }

    private static String read(HttpURLConnection connection) throws Exception {
        try (InputStream in = connection.getInputStream()) {
            ByteArrayOutputStream buffer = new ByteArrayOutputStream();
            byte[] chunk = new byte[8192];
            int count;
            while ((count = in.read(chunk)) != -1) buffer.write(chunk, 0, count);
            return buffer.toString("UTF-8");
        }
    }

    /** Minimal field reader; swap in Jackson or Gson in a real project. */
    private static String field(String json, String name) {
        int at = json.indexOf("\\"" + name + "\\"");
        if (at < 0) return null;

        int colon = json.indexOf(':', at);
        if (colon < 0) return null;

        int start = colon + 1;
        while (start < json.length() && Character.isWhitespace(json.charAt(start))) start++;
        if (start >= json.length()) return null;

        if (json.charAt(start) == '"') {
            int end = json.indexOf('"', start + 1);
            return end < 0 ? null : json.substring(start + 1, end);
        }

        int end = start;
        while (end < json.length() && ",}]".indexOf(json.charAt(end)) < 0) end++;
        return json.substring(start, end).trim();
    }

    private static State parse(String json) {
        State state = new State();
        String status = field(json, "status");
        if (status != null) state.status = status;
        state.token = field(json, "license_token");
        state.errorType = field(json, "error_type");
        return state;
    }

    public static State activate(String key, String instanceId, String fingerprint, String email) throws Exception {
        Map<String, String> fields = new LinkedHashMap<>();
        fields.put("item_id", String.valueOf(PRODUCT_ID));
        fields.put("license_key", key.trim());
        fields.put("site_url", instanceId);
        fields.put("device_fingerprint", fingerprint);
        fields.put("device_name", System.getenv().getOrDefault("COMPUTERNAME", "desktop"));
        fields.put("device_type", "Desktop (JVM)");
        fields.put("os", System.getProperty("os.name") + " " + System.getProperty("os.arch"));
        fields.put("email", email);
        fields.put("server_version", "1.0.0");
        return parse(post("activate_license", fields));
    }

    public static State check(String key, String instanceId, String fingerprint) throws Exception {
        Map<String, String> fields = new LinkedHashMap<>();
        fields.put("item_id", String.valueOf(PRODUCT_ID));
        fields.put("license_key", key);
        fields.put("site_url", instanceId);
        fields.put("device_fingerprint", fingerprint);
        return parse(post("check_license", fields));
    }

    public static void deactivate(String key, String instanceId) throws Exception {
        Map<String, String> fields = new LinkedHashMap<>();
        fields.put("item_id", String.valueOf(PRODUCT_ID));
        fields.put("license_key", key);
        fields.put("site_url", instanceId);
        post("deactivate_license", fields);
    }

    public static boolean verifyToken(String token, String publicKeyPem) throws Exception {
        String[] parts = token.split("\\\\.");
        if (parts.length != 3) return false;

        String pem = publicKeyPem
            .replace("-----BEGIN PUBLIC KEY-----", "")
            .replace("-----END PUBLIC KEY-----", "")
            .replaceAll("\\\\s", "");

        PublicKey key = KeyFactory.getInstance("RSA")
            .generatePublic(new X509EncodedKeySpec(Base64.getDecoder().decode(pem)));

        Signature verifier = Signature.getInstance("SHA256withRSA");
        verifier.initVerify(key);
        verifier.update((parts[0] + "." + parts[1]).getBytes(StandardCharsets.UTF_8));

        return verifier.verify(Base64.getUrlDecoder().decode(parts[2]));
    }

    public static String latestRelease(String key, String currentVersion, String platform) throws Exception {
        String url = STORE + "?fluent-cart=fastr_release_latest"
            + "&product_id=" + PRODUCT_ID
            + "&platform=" + URLEncoder.encode(platform, "UTF-8")
            + "&current_version=" + URLEncoder.encode(currentVersion, "UTF-8")
            + "&license_key=" + URLEncoder.encode(key, "UTF-8");

        HttpURLConnection connection = (HttpURLConnection) new URL(url).openConnection();
        connection.setConnectTimeout(15000);
        connection.setReadTimeout(15000);

        return read(connection);
    }

    public static String reportUsage(String key, String metric, int quantity, String idempotencyKey) throws Exception {
        Map<String, String> fields = new LinkedHashMap<>();
        fields.put("license_key", key);
        fields.put("metric", metric);
        fields.put("quantity", String.valueOf(quantity));
        fields.put("idempotency_key", idempotencyKey);
        return post("fastr_usage_report", fields);
    }
}
`;
  }

  if (platform === 'php') {
    return `<?php

declare(strict_types=1);

${banner(appName, 'PHP (no WordPress)', 'FastrLicense.php', base, productId)}

final class FastrLicense
{
    public const STORE = '${base}';
    public const PRODUCT_ID = ${productId};

    private static function post(string $verb, array $fields): array
    {
        $handle = curl_init(self::STORE . '?fluent-cart=' . $verb);
        curl_setopt_array($handle, [
            CURLOPT_POST           => true,
            CURLOPT_POSTFIELDS     => http_build_query($fields),
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_TIMEOUT        => 15,
        ]);

        $body = curl_exec($handle);
        curl_close($handle);

        $json = is_string($body) ? json_decode($body, true) : null;

        return is_array($json) ? $json : [];
    }

    public static function activate(string $key, string $instanceId, string $fingerprint, string $email): array
    {
        return self::post('activate_license', [
            'item_id'            => (string) self::PRODUCT_ID,
            'license_key'        => trim($key),
            'site_url'           => $instanceId,
            'device_fingerprint' => $fingerprint,
            'device_name'        => gethostname() ?: 'desktop',
            'device_type'        => 'CLI (PHP)',
            'os'                 => PHP_OS_FAMILY,
            'email'              => $email,
            'server_version'     => '1.0.0',
        ]);
    }

    public static function check(string $key, string $instanceId, string $fingerprint): array
    {
        return self::post('check_license', [
            'item_id'            => (string) self::PRODUCT_ID,
            'license_key'        => $key,
            'site_url'           => $instanceId,
            'device_fingerprint' => $fingerprint,
        ]);
    }

    public static function deactivate(string $key, string $instanceId): array
    {
        return self::post('deactivate_license', [
            'item_id'     => (string) self::PRODUCT_ID,
            'license_key' => $key,
            'site_url'    => $instanceId,
        ]);
    }

    /** The signed offline licence; pass it to verifyToken(). */
    public static function token(array $state): ?string
    {
        return $state['license_token'] ?? null;
    }

    /** Valid only when status === 'valid'. key_mismatch arrives as 200 + success. */
    public static function isValid(array $state): bool
    {
        return ($state['status'] ?? '') === 'valid';
    }

    public static function verifyToken(string $token, string $publicKeyPem): ?array
    {
        $parts = explode('.', $token);

        if (count($parts) !== 3) {
            return null;
        }

        $signature = self::base64UrlDecode($parts[2]);

        if ($signature === null || openssl_verify($parts[0] . '.' . $parts[1], $signature, $publicKeyPem, OPENSSL_ALGO_SHA256) !== 1) {
            return null;
        }

        $payload = self::base64UrlDecode($parts[1]);
        $claims  = $payload === null ? null : json_decode($payload, true);

        if (!is_array($claims)) {
            return null;
        }

        if (isset($claims['exp']) && (int) $claims['exp'] < time()) {
            return null;
        }

        return $claims;
    }

    public static function latestRelease(string $key, string $currentVersion, string $platform = 'any'): array
    {
        $query = http_build_query([
            'product_id'      => self::PRODUCT_ID,
            'platform'        => $platform,
            'current_version' => $currentVersion,
            'license_key'     => $key,
        ]);

        $body = @file_get_contents(self::STORE . '?fluent-cart=fastr_release_latest&' . $query);
        $json = is_string($body) ? json_decode($body, true) : null;

        return is_array($json) ? $json : [];
    }

    public static function reportUsage(string $key, string $metric, int $quantity, string $idempotencyKey): array
    {
        return self::post('fastr_usage_report', [
            'license_key'     => $key,
            'metric'          => $metric,
            'quantity'        => (string) $quantity,
            'idempotency_key' => $idempotencyKey,
        ]);
    }

    private static function base64UrlDecode(string $value): ?string
    {
        $padded = strtr($value, '-_', '+/');
        $padded .= str_repeat('=', (4 - strlen($padded) % 4) % 4);

        $decoded = base64_decode($padded, true);

        return $decoded === false ? null : $decoded;
    }
}
`;
  }

  return `${banner(appName, 'C (libcurl + OpenSSL)', 'fastr_license.c', base, productId)}
#include <curl/curl.h>
#include <openssl/bio.h>
#include <openssl/evp.h>
#include <openssl/pem.h>
#include <stdio.h>
#include <stdlib.h>
#include <string.h>

#define FASTR_STORE "${base}"
#define FASTR_PRODUCT ${productId}

/* The activate/check body carries "license_token"; hand it to
 * fastr_verify_token() so the app can run offline without a heartbeat. */
struct buffer { char *data; size_t size; };

static size_t on_body(void *chunk, size_t size, size_t count, void *user)
{
    struct buffer *buffer = (struct buffer *) user;
    size_t total = size * count;

    char *grown = realloc(buffer->data, buffer->size + total + 1);
    if (grown == NULL) return 0;

    buffer->data = grown;
    memcpy(buffer->data + buffer->size, chunk, total);
    buffer->size += total;
    buffer->data[buffer->size] = '\\0';

    return total;
}

/* POST a form to ?fluent-cart=<verb>. Caller frees the returned buffer. */
static char *fastr_post(const char *verb, const char *form)
{
    CURL *curl = curl_easy_init();
    if (curl == NULL) return NULL;

    struct buffer response = { NULL, 0 };
    char url[512];
    snprintf(url, sizeof(url), "%s?fluent-cart=%s", FASTR_STORE, verb);

    curl_easy_setopt(curl, CURLOPT_URL, url);
    curl_easy_setopt(curl, CURLOPT_POSTFIELDS, form);
    curl_easy_setopt(curl, CURLOPT_WRITEFUNCTION, on_body);
    curl_easy_setopt(curl, CURLOPT_WRITEDATA, &response);
    curl_easy_setopt(curl, CURLOPT_TIMEOUT, 15L);

    CURLcode result = curl_easy_perform(curl);
    curl_easy_cleanup(curl);

    if (result != CURLE_OK) { free(response.data); return NULL; }

    return response.data;
}

/* Valid only when the body carries "status":"valid". key_mismatch and
 * invalid_activation arrive as HTTP 200 with success=true. */
static int fastr_status_is_valid(const char *json)
{
    return json != NULL && strstr(json, "\\"status\\":\\"valid\\"") != NULL;
}

char *fastr_activate(const char *license_key, const char *instance_id,
                     const char *fingerprint, const char *email)
{
    char form[1024];
    snprintf(form, sizeof(form),
             "item_id=%d&license_key=%s&site_url=%s&device_fingerprint=%s"
             "&device_type=CLI%%20(C)&server_version=1.0.0&email=%s",
             FASTR_PRODUCT, license_key, instance_id, fingerprint, email);

    return fastr_post("activate_license", form);
}

char *fastr_check(const char *license_key, const char *instance_id, const char *fingerprint)
{
    char form[512];
    snprintf(form, sizeof(form),
             "item_id=%d&license_key=%s&site_url=%s&device_fingerprint=%s",
             FASTR_PRODUCT, license_key, instance_id, fingerprint);

    return fastr_post("check_license", form);
}

char *fastr_deactivate(const char *license_key, const char *instance_id)
{
    char form[512];
    snprintf(form, sizeof(form),
             "item_id=%d&license_key=%s&site_url=%s",
             FASTR_PRODUCT, license_key, instance_id);

    return fastr_post("deactivate_license", form);
}

char *fastr_report_usage(const char *license_key, const char *metric,
                         int quantity, const char *idempotency_key)
{
    char form[512];
    snprintf(form, sizeof(form),
             "license_key=%s&metric=%s&quantity=%d&idempotency_key=%s",
             license_key, metric, quantity, idempotency_key);

    return fastr_post("fastr_usage_report", form);
}

char *fastr_latest_release(const char *license_key, const char *current_version)
{
    CURL *curl = curl_easy_init();
    if (curl == NULL) return NULL;

    struct buffer response = { NULL, 0 };
    char url[512];
    snprintf(url, sizeof(url),
             "%s?fluent-cart=fastr_release_latest&product_id=%d"
             "&platform=any&current_version=%s&license_key=%s",
             FASTR_STORE, FASTR_PRODUCT, current_version, license_key);

    curl_easy_setopt(curl, CURLOPT_URL, url);
    curl_easy_setopt(curl, CURLOPT_WRITEFUNCTION, on_body);
    curl_easy_setopt(curl, CURLOPT_WRITEDATA, &response);
    curl_easy_setopt(curl, CURLOPT_TIMEOUT, 15L);

    CURLcode result = curl_easy_perform(curl);
    curl_easy_cleanup(curl);

    if (result != CURLE_OK) { free(response.data); return NULL; }

    return response.data;
}

/* RS256 verification. Returns 1 when the signature is good. */
int fastr_verify_token(const char *token, const char *public_key_pem)
{
    char *copy = strdup(token);
    if (copy == NULL) return 0;

    char *header = strtok(copy, ".");
    char *payload = strtok(NULL, ".");
    char *signature_part = strtok(NULL, ".");

    if (header == NULL || payload == NULL || signature_part == NULL) { free(copy); return 0; }

    char signed_input[4096];
    snprintf(signed_input, sizeof(signed_input), "%s.%s", header, payload);

    BIO *bio = BIO_new_mem_buf(public_key_pem, -1);
    if (bio == NULL) { free(copy); return 0; }

    EVP_PKEY *key = PEM_read_bio_PUBKEY(bio, NULL, NULL, NULL);
    BIO_free(bio);

    if (key == NULL) { free(copy); return 0; }

    for (char *p = signature_part; *p; p++) {
        if (*p == '-') *p = '+';
        else if (*p == '_') *p = '/';
    }

    size_t signature_len = strlen(signature_part);
    size_t padding = (4 - signature_len % 4) % 4;
    for (size_t i = 0; i < padding; i++) strcat(signature_part, "=");

    unsigned char signature[1024];
    int decoded = EVP_DecodeBlock(signature, (unsigned char *) signature_part, (int) strlen(signature_part));

    if (decoded < 0) { EVP_PKEY_free(key); free(copy); return 0; }

    decoded -= (int) padding;

    EVP_MD_CTX *ctx = EVP_MD_CTX_new();
    int ok = 0;

    if (ctx != NULL &&
        EVP_DigestVerifyInit(ctx, NULL, EVP_sha256(), NULL, key) == 1 &&
        EVP_DigestVerifyUpdate(ctx, signed_input, strlen(signed_input)) == 1) {
        ok = EVP_DigestVerifyFinal(ctx, signature, (size_t) decoded) == 1;
    }

    if (ctx != NULL) EVP_MD_CTX_free(ctx);
    EVP_PKEY_free(key);
    free(copy);

    return ok;
}
`;
}
