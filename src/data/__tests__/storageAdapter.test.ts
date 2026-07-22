import { describe, it, expect, beforeEach } from 'vitest';
import { storage } from '../storageAdapter';

describe('storageAdapter', () => {
  beforeEach(() => {
    storage.clear();
  });

  it('should set and get items accurately', () => {
    storage.set('test_key', { foo: 'bar', count: 42 });
    const data = storage.get('test_key', null);
    expect(data).toEqual({ foo: 'bar', count: 42 });
  });

  it('should return default value when key does not exist', () => {
    const val = storage.get('non_existent', 'default_str');
    expect(val).toBe('default_str');
  });

  it('should detect existence of keys using has()', () => {
    expect(storage.has('item1')).toBe(false);
    storage.set('item1', 'value1');
    expect(storage.has('item1')).toBe(true);
  });

  it('should remove items correctly', () => {
    storage.set('item2', 100);
    expect(storage.has('item2')).toBe(true);
    storage.remove('item2');
    expect(storage.has('item2')).toBe(false);
    expect(storage.get('item2', null)).toBeNull();
  });

  it('should clear all edupulse prefixed items', () => {
    storage.set('a', 1);
    storage.set('b', 2);
    expect(storage.has('a')).toBe(true);
    expect(storage.has('b')).toBe(true);
    storage.clear();
    expect(storage.has('a')).toBe(false);
    expect(storage.has('b')).toBe(false);
  });
});
